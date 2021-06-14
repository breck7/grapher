import { Router, Request, Response, RequestHandler } from "express"
import {
    GIT_DEFAULT_USERNAME,
    GIT_DEFAULT_EMAIL,
} from "../settings/serverSettings"
import simpleGit, { SimpleGit } from "simple-git"
import {
    writeFile,
    existsSync,
    readFile,
    unlink,
    readFileSync,
    mkdirSync,
} from "fs-extra"
import {
    WriteRequest,
    ReadRequest,
    DeleteRequest,
    GlobRequest,
    GitPullResponse,
    GitCmsGlobResponse,
    GitCmsResponse,
    GitCmsReadResponse,
    GIT_CMS_GLOB_ROUTE,
    GIT_CMS_READ_ROUTE,
    GIT_CMS_WRITE_ROUTE,
    GIT_CMS_DELETE_ROUTE,
    GIT_CMS_PULL_ROUTE,
} from "./GitCmsConstants"
import { sync } from "glob"

interface GitCmsServerOptions {
    baseDir: string
    shouldAutoPush?: boolean
}

export class GitCmsServer {
    private _options: GitCmsServerOptions
    verbose = true // I made this public so you can test quietly

    constructor(options: GitCmsServerOptions) {
        this._options = options
    }

    // todo: we should probably use the 'path' lib and standardize things for cross plat
    private get baseDir() {
        return this.options.baseDir + "/"
    }

    private get options() {
        return this._options
    }

    private _git?: SimpleGit
    private get git() {
        if (!this._git)
            this._git = simpleGit({
                baseDir: this.baseDir,
                binary: "git",
                maxConcurrentProcesses: 1,
            })
        return this._git
    }

    async createDirAndInitIfNeeded() {
        const { baseDir } = this
        if (!existsSync(baseDir)) mkdirSync(baseDir)
        await this.git.init()

        // Needed since git won't let you commit if there's no user name config present (i.e. CI), even if you always
        // specify `author=` in every command. See https://stackoverflow.com/q/29685337/10670163 for example.
        await this.git.addConfig("user.name", GIT_DEFAULT_USERNAME)
        await this.git.addConfig("user.email", GIT_DEFAULT_EMAIL)
        return this
    }

    private async commitFile(
        filename: string,
        commitMsg: string,
        authorName: string,
        authorEmail: string
    ) {
        await this.git.add(filename)
        return await this.git.commit(commitMsg, filename, {
            "--author": `${authorName} <${authorEmail}>`,
        })
    }

    private async autopush() {
        if (this.options.shouldAutoPush) this.git.push()
    }

    private async pullCommand() {
        try {
            const res = await this.git.pull()
            return {
                success: true,
                stdout: JSON.stringify(res.summary, null, 2),
            } as GitPullResponse
        } catch (error) {
            if (this.verbose) console.log(error)
            return { success: false, error }
        }
    }

    private async readFileCommand(
        filepath: string
    ): Promise<GitCmsReadResponse> {
        try {
            ensureNoParentLinksInFilePath(filepath)

            const absolutePath = this.baseDir + filepath
            const exists = existsSync(absolutePath)
            if (!exists) throw new Error(`File '${filepath}' not found`)
            const content = await readFile(absolutePath, "utf8")
            return { success: true, content }
        } catch (error) {
            if (this.verbose) console.log(error)
            return {
                success: false,
                error,
                content: "",
            }
        }
    }

    private async globCommand(
        globStr: string,
        folder: string
    ): Promise<GitCmsGlobResponse> {
        const query = globStr.replace(/[^a-zA-Z\*]/, "")
        const cwd = this.baseDir + folder
        const results = sync(query, {
            cwd,
        })

        const files = results.map((filename) => {
            return {
                filename,
                content: readFileSync(cwd + "/" + filename, "utf8"),
            }
        })

        return { success: true, files }
    }

    private async deleteFileCommand(
        rawFilepath: string,
        authorName = GIT_DEFAULT_USERNAME,
        authorEmail = GIT_DEFAULT_EMAIL
    ): Promise<GitCmsResponse> {
        const filepath = rawFilepath.replace(/\~/g, "/")
        try {
            ensureNoParentLinksInFilePath(filepath)

            const absolutePath = this.baseDir + filepath
            await unlink(absolutePath)
            await this.commitFile(
                filepath,
                `Deleted ${filepath}`,
                authorName,
                authorEmail
            )

            await this.autopush()
            return { success: true }
        } catch (error) {
            if (this.verbose) console.log(error)
            return { success: false, error }
        }
    }

    private async writeFileCommand(
        filename: string,
        content: string,
        authorName = GIT_DEFAULT_USERNAME,
        authorEmail = GIT_DEFAULT_EMAIL,
        commitMessage?: string
    ): Promise<GitCmsResponse> {
        try {
            ensureNoParentLinksInFilePath(filename)

            const absolutePath = this.baseDir + filename
            await writeFile(absolutePath, content, "utf8")

            const commitMsg = commitMessage
                ? commitMessage
                : existsSync(absolutePath)
                ? `Updating ${filename}`
                : `Adding ${filename}`

            await this.commitFile(filename, commitMsg, authorName, authorEmail)
            await this.autopush()
            return { success: true }
        } catch (error) {
            if (this.verbose) console.log(error)
            return { success: false, error }
        }
    }

    addToRouter(app: Router) {
        const routes: { [route: string]: RequestHandler } = {}

        routes[GIT_CMS_PULL_ROUTE] = async (req: Request, res: Response) =>
            res.send(await this.pullCommand()) // Pull latest from github

        routes[GIT_CMS_GLOB_ROUTE] = async (req: Request, res: Response) => {
            // Get multiple file contents
            const request = req.body as GlobRequest
            res.send(await this.globCommand(request.glob, request.folder))
        }

        routes[GIT_CMS_READ_ROUTE] = async (req: Request, res: Response) => {
            const request = req.body as ReadRequest
            res.send(await this.readFileCommand(request.filepath))
        }

        routes[GIT_CMS_WRITE_ROUTE] = async (req: Request, res: Response) => {
            // Update/create file, commit, and push(unless on local dev brach)
            const request = req.body as WriteRequest
            const { filepath, content, commitMessage } = request
            res.send(
                await this.writeFileCommand(
                    filepath,
                    content,
                    "GrapherGenius", // todo: these are specific to our admin app
                    "GrapherGenius@breckyunits.com",
                    commitMessage
                )
            )
        }

        routes[GIT_CMS_DELETE_ROUTE] = async (req: Request, res: Response) => {
            // Delete file, commit, and and push(unless on local dev brach)
            const request = req.body as DeleteRequest
            res.send(
                await this.deleteFileCommand(
                    request.filepath,
                    "GrapherGenius",
                    "GrapherGenius@breckyunits.com"
                )
            )
        }

        // Note: these are all POST routes, because we never want to cache any of them (even the 2 read ops)
        Object.keys(routes).forEach((route) => app.post(route, routes[route]))
    }
}

const ensureNoParentLinksInFilePath = (filename: string) => {
    if (filename.includes(".."))
        throw new Error(`Invalid filepath: ${filename}`)
}
