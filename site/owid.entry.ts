import "site/owid.scss"
import "grapher/core/grapher.scss"
// From https://fontawesome.com/how-to-use/on-the-web/other-topics/server-side-rendering:
// "If the CSS is missing when this icon displays in the browser it will flash
// from a very large icon down to a properly sized one a moment later."
import "@fortawesome/fontawesome-svg-core/styles.css"

import SmoothScroll from "smooth-scroll"
import { runChartsIndexPage } from "./runChartsIndexPage"
import { runNotFoundPage } from "./NotFoundPageMain"
import { runBlocks } from "./blocks"
import { runLightbox } from "./Lightbox"
import { hydrateGlobalEntityControlIfAny } from "../grapher/controls/globalEntityControl/GlobalEntityControl"
import { runFootnotes } from "./Footnote"
import { Explorer } from "../explorer/Explorer"
import { BAKED_BASE_URL, ENV } from "../settings/clientSettings"
import { GRAPHER_PAGE_BODY_CLASS } from "../grapher/core/GrapherConstants"
import { Grapher } from "../grapher/core/Grapher"
import { MultiEmbedderSingleton } from "../site/multiembedder/MultiEmbedder"
import { CoreTable } from "../coreTable/CoreTable"
import { SiteAnalytics } from "./SiteAnalytics"

declare var window: any
window.Grapher = Grapher
window.Explorer = Explorer
window.CoreTable = CoreTable
window.runChartsIndexPage = runChartsIndexPage
window.runNotFoundPage = runNotFoundPage
window.MultiEmbedderSingleton = MultiEmbedderSingleton

// Note: do a text search of the project for "runSiteFooterScripts" to find the usage. todo: clean that up.
window.runSiteFooterScripts = () => {
    runBlocks()
    runLightbox()
    runFootnotes()
    if (!document.querySelector(`.${GRAPHER_PAGE_BODY_CLASS}`)) {
        MultiEmbedderSingleton.embedAll()
        hydrateGlobalEntityControlIfAny()
    }
}

const analytics = new SiteAnalytics(ENV)
analytics.logPageLoad()

document.querySelector("html")?.classList.add("js")

new SmoothScroll('a[href*="#"][data-smooth-scroll]', {
    speed: 600,
    durationMax: 800,
    durationMin: 100,
    popstate: false,
})

const dataTrackAttr = "data-track-note"

const getParent = (
    el: HTMLElement,
    condition: (el: HTMLElement) => boolean
): HTMLElement | null => {
    let current: HTMLElement | null = el
    while (current) {
        if (condition(current)) return current
        current = current.parentElement
    }
    return null
}

document.addEventListener("click", async (ev) => {
    const targetElement = ev.target as HTMLElement
    const trackedElement = getParent(
        targetElement,
        (el: HTMLElement) => el.getAttribute(dataTrackAttr) !== null
    )
    if (trackedElement) {
        // Note that browsers will cancel all pending requests once a user
        // navigates away from a page. An earlier implementation had a
        // timeout to send the event before navigating, but it broke
        // CMD+CLICK for opening a new tab.
        analytics.logSiteClick(
            trackedElement.innerText,
            trackedElement.getAttribute("href") || undefined,
            trackedElement.getAttribute(dataTrackAttr) || undefined
        )
    }
})
