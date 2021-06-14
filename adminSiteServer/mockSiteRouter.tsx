import express, { Router } from "express"
import * as path from "path"
import {
    renderFrontPage,
    renderPageBySlug,
    renderChartsPage,
    renderMenuJson,
    renderSearchPage,
    renderDonatePage,
    entriesByYearPage,
    makeAtomFeed,
    pagePerVariable,
    feedbackPage,
    renderNotFoundPage,
    renderBlogByPageNum,
    renderCovidPage,
    countryProfileCountryPage,
} from "../baker/siteRenderers"
import { grapherSlugToHtmlPage } from "../baker/GrapherBaker"
import {
    BAKED_BASE_URL,
    BAKED_GRAPHER_URL,
    WORDPRESS_DIR,
    BASE_DIR,
    BAKED_SITE_DIR,
} from "../settings/serverSettings"

import { expectInt, renderToHtmlPage } from "./serverUtil"
import {
    countryProfilePage,
    countriesIndexPage,
} from "../baker/countryProfiles"
import { makeSitemap } from "../baker/sitemap"
import { countryProfileSpecs } from "../site/countryProfileProjects"
import { ExplorerAdminServer } from "../explorerAdmin/ExplorerAdminServer"
import { grapherToSVG } from "../baker/GrapherImageBaker"
import { MultiEmbedderTestPage } from "../site/multiembedder/MultiEmbedderTestPage"
import { bakeEmbedSnippet } from "../site/webpackUtils"
import { JsonError } from "../clientUtils/owidTypes"
import { GIT_CMS_DIR } from "../gitCms/GitCmsConstants"

require("express-async-errors")

// todo: switch to an object literal where the key is the path and the value is the request handler? easier to test, reflect on, and manipulate
const mockSiteRouter = Router()

mockSiteRouter.use(express.urlencoded({ extended: true }))
mockSiteRouter.use(express.json())

const explorerAdminServer = new ExplorerAdminServer(GIT_CMS_DIR, BAKED_BASE_URL)
explorerAdminServer.addMockBakedSiteRoutes(mockSiteRouter)

mockSiteRouter.get("/", async (req, res) => res.send(await renderFrontPage()))

mockSiteRouter.get("/headerMenu.json", async (req, res) =>
    res.send(await renderMenuJson())
)

mockSiteRouter.use("/", express.static(path.join(BASE_DIR, "public")))

mockSiteRouter.get("/multiEmbedderTest", async (req, res) =>
    res.send(
        renderToHtmlPage(
            MultiEmbedderTestPage(req.query.globalEntityControl === "true")
        )
    )
)

mockSiteRouter.get("/*", async (req, res) => {
    const slug = req.path.replace(/^\//, "").replace("/", "__")
    try {
        res.send(await renderPageBySlug(slug))
    } catch (e) {
        console.error(e)
        res.send(await renderNotFoundPage())
    }
})

export { mockSiteRouter }
