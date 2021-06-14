import * as React from "react"
import { webpackUrl } from "../site/webpackUtils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight"

interface SiteFooterProps {
    baseUrl: string
}

export const SiteFooter = (props: SiteFooterProps) => (
    <>
        <footer className="site-footer">
            <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=es6,fetch" />
            <script src={webpackUrl("commons.js", props.baseUrl)} />
            <script src={webpackUrl("owid.js", props.baseUrl)} />
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.runSiteFooterScripts()`, // todo: gotta be a better way.
                }}
            />
        </footer>
    </>
)
