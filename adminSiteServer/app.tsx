import * as React from "react"
import simpleGit from "simple-git"
import express from "express"
require("express-async-errors") // todo: why the require?
import cookieParser from "cookie-parser"
import "reflect-metadata"

import {
    ADMIN_SERVER_HOST,
    ADMIN_SERVER_PORT,
    ENV,
    SLACK_ERRORS_WEBHOOK_URL,
} from "../settings/serverSettings"
import { IndexPage } from "./IndexPage"
import { adminRouter } from "./adminRouter"
import { renderToHtmlPage } from "./serverUtil"

import { mockSiteRouter } from "./mockSiteRouter"
import { GIT_CMS_DIR } from "../gitCms/GitCmsConstants"

interface OwidAdminAppOptions {
    gitCmsDir: string
    isDev: boolean
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

    async startListening(adminServerPort: number, adminServerHost: string) {
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
                        username={res.locals.user.fullName}
                        isSuperuser={res.locals.user.isSuperuser}
                        gitCmsBranchName={this.gitCmsBranchName}
                    />
                )
            )
        })

        // todo: we probably always want to have this, and can remove the isDev
        if (this.options.isDev) app.use("/", mockSiteRouter)

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
        isDev: ENV === "development",
    }).startListening(ADMIN_SERVER_PORT, ADMIN_SERVER_HOST)
