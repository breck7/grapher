import * as React from "react"
import simpleGit from "simple-git"
import express from "express"
require("express-async-errors") // todo: why the require?
import cookieParser from "cookie-parser"
import "reflect-metadata"
import {
    ADMIN_SERVER_HOST,
    ADMIN_SERVER_PORT,
} from "../settings/serverSettings"
import { IndexPage } from "./IndexPage"
import { renderToHtmlPage } from "./serverUtil"
import { mockSiteRouter } from "./mockSiteRouter"
import { Request, Response, Router } from "express"
import { BAKED_BASE_URL } from "../settings/serverSettings"
import { ExplorerAdminServer } from "../explorerAdmin/ExplorerAdminServer"
import { GIT_CMS_DIR } from "../gitCms/GitCmsConstants"
import { GitCmsServer } from "../gitCms/GitCmsServer"

const adminRouter = Router()

// Parse incoming requests with JSON payloads http://expressjs.com/en/api.html
adminRouter.use(express.json({ limit: "50mb" }))

const explorerAdminServer = new ExplorerAdminServer(GIT_CMS_DIR, BAKED_BASE_URL)
explorerAdminServer.addAdminRoutes(adminRouter)

const gitCmsServer = new GitCmsServer({
    baseDir: GIT_CMS_DIR,
    shouldAutoPush: true,
})
gitCmsServer.createDirAndInitIfNeeded()
gitCmsServer.addToRouter(adminRouter)

interface OwidAdminAppOptions {
    gitCmsDir: string
    quiet?: boolean
}

export class OwidAdminApp {
    constructor(options: OwidAdminAppOptions) {
        this.options = options
    }

    app = express()
    private options: OwidAdminAppOptions

    private async getGitCmsBranchName() {
        const git = simpleGit({
            baseDir: this.options.gitCmsDir,
            binary: "git",
            maxConcurrentProcesses: 1,
        })
        const branches = await git.branchLocal()
        const gitCmsBranchName = await branches.current
        return gitCmsBranchName
    }

    private gitCmsBranchName = ""

    async startListening(
        adminServerPort: number,
        adminServerHost: string,
        verbose = true
    ) {
        this.gitCmsBranchName = await this.getGitCmsBranchName()
        const { app } = this

        // since the server is running behind a reverse proxy (nginx), we need to "trust"
        // the X-Forwarded-For header in order to get the real request IP
        // https://expressjs.com/en/guide/behind-proxies.html
        app.set("trust proxy", true)

        // Parse cookies https://github.com/expressjs/cookie-parser
        app.use(cookieParser())

        app.use(express.urlencoded({ extended: true, limit: "50mb" }))

        app.use("/admin/assets", express.static("itsJustJavascript/webpack"))
        app.use("/admin/storybook", express.static(".storybook/build"))
        app.use("/admin", adminRouter)

        // Default route: single page admin app
        app.get("/admin/*", async (req, res) => {
            res.send(
                renderToHtmlPage(
                    <IndexPage
                        username={"GrapherGenius"}
                        gitCmsBranchName={this.gitCmsBranchName}
                    />
                )
            )
        })

        app.use("/", mockSiteRouter)

        // Give full error messages, including in production
        app.use(
            async (err: any, req: any, res: express.Response, next: any) => {
                if (!res.headersSent) {
                    res.status(err.status || 500)
                    res.send({
                        error: {
                            message: err.stack || err,
                            status: err.status || 500,
                        },
                    })
                } else {
                    res.write(
                        JSON.stringify({
                            error: {
                                message: err.stack || err,
                                status: err.status || 500,
                            },
                        })
                    )
                    res.end()
                }
            }
        )

        const server = app.listen(adminServerPort, adminServerHost, () => {
            if (verbose)
                console.log(
                    `owid-admin server started on http://${adminServerHost}:${adminServerPort}`
                )
        })
        // Increase server timeout for long-running uploads
        server.timeout = 5 * 60 * 1000

        return server
    }
}

if (!module.parent)
    new OwidAdminApp({
        gitCmsDir: GIT_CMS_DIR,
    }).startListening(ADMIN_SERVER_PORT, ADMIN_SERVER_HOST)
