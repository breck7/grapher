import React from "react"
import { Head } from "../site/Head"
import { SiteHeader } from "../site/SiteHeader"
import { SiteFooter } from "../site/SiteFooter"
import { LoadingIndicator } from "../grapher/loadingIndicator/LoadingIndicator"
import { IFrameDetector } from "../site/IframeDetector"
import { SiteSubnavigation } from "../site/SiteSubnavigation"
import {
    EMBEDDED_EXPLORER_DELIMITER,
    ExplorerContainerId,
} from "../explorer/ExplorerConstants"
import { ExplorerProgram } from "../explorer/ExplorerProgram"
import { GrapherInterface } from "../grapher/core/GrapherInterface"
import { serializeJSONForHTML } from "../clientUtils/serializers"
import { GRAPHER_PAGE_BODY_CLASS } from "../grapher/core/GrapherConstants"
import { ExplorerPageUrlMigrationSpec } from "../explorer/urlMigrations/ExplorerPageUrlMigrationSpec"

interface ExplorerPageSettings {
    program: ExplorerProgram
    baseUrl: string
    urlMigrationSpec?: ExplorerPageUrlMigrationSpec
}

export const ExplorerPage = (props: ExplorerPageSettings) => {
    const { program, baseUrl, urlMigrationSpec } = props
    const {
        subNavId,
        subNavCurrentId,
        explorerTitle,
        slug,
        thumbnail,
    } = program
    const subNav = subNavId ? (
        <SiteSubnavigation
            subnavId={subNavId}
            subnavCurrentId={subNavCurrentId}
        />
    ) : undefined

    const inlineJs = `const explorerProgram = ${serializeJSONForHTML(
        program.toJson(),
        EMBEDDED_EXPLORER_DELIMITER
    )};
const urlMigrationSpec = ${
        urlMigrationSpec ? JSON.stringify(urlMigrationSpec) : "undefined"
    };
window.Explorer.renderSingleExplorerOnExplorerPage(explorerProgram, urlMigrationSpec);`

    return (
        <html>
            <Head
                canonicalUrl={`${baseUrl}/${slug}`}
                pageTitle={explorerTitle}
                imageUrl={`${baseUrl}/${thumbnail} `}
                baseUrl={baseUrl}
            >
                <IFrameDetector />
            </Head>
            <body className={GRAPHER_PAGE_BODY_CLASS}>
                <SiteHeader baseUrl={baseUrl} />
                {subNav}
                <main id={ExplorerContainerId}>
                    <LoadingIndicator />
                </main>
                <SiteFooter baseUrl={baseUrl} />
                <script dangerouslySetInnerHTML={{ __html: inlineJs }} />
            </body>
        </html>
    )
}
