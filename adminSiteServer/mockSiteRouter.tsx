import express, { Router } from "express"
import * as path from "path"
import {
    BAKED_BASE_URL,
    BAKED_GRAPHER_URL,
    WORDPRESS_DIR,
    BASE_DIR,
    BAKED_SITE_DIR,
} from "../settings/serverSettings"

import { expectInt, renderToHtmlPage } from "./serverUtil"
import { ExplorerAdminServer } from "../explorerAdmin/ExplorerAdminServer"
import { MultiEmbedderTestPage } from "../site/multiembedder/MultiEmbedderTestPage"
import { JsonError } from "../clientUtils/owidTypes"
import { GIT_CMS_DIR } from "../gitCms/GitCmsConstants"

require("express-async-errors")

// todo: switch to an object literal where the key is the path and the value is the request handler? easier to test, reflect on, and manipulate
const mockSiteRouter = Router()

mockSiteRouter.use(express.urlencoded({ extended: true }))
mockSiteRouter.use(express.json())

const explorerAdminServer = new ExplorerAdminServer(GIT_CMS_DIR, BAKED_BASE_URL)
explorerAdminServer.addMockBakedSiteRoutes(mockSiteRouter)

mockSiteRouter.get("/", async (req, res) => res.redirect("/admin/"))

mockSiteRouter.use("/", express.static(path.join(BASE_DIR, "public")))

mockSiteRouter.get("/multiEmbedderTest", async (req, res) =>
    res.send(
        renderToHtmlPage(
            MultiEmbedderTestPage(req.query.globalEntityControl === "true")
        )
    )
)

export { mockSiteRouter }
