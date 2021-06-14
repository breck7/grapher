import * as fs from "fs-extra" // todo: this should not be here.
import urljoin from "url-join"
import * as path from "path"
import { ENV } from "../settings/serverSettings"

const WEBPACK_DEV_URL = process.env.WEBPACK_DEV_URL ?? "http://localhost:8090"
const WEBPACK_OUTPUT_PATH =
    process.env.WEBPACK_OUTPUT_PATH ?? path.join(__dirname + "/../", "webpack")

let manifest: { [key: string]: string }
export const webpackUrl = (
    assetName: string,
    baseUrl = "",
    isProduction = ENV === "production"
) => {
    if (isProduction) {
        // Read the real asset name from the manifest in case it has a hashed filename
        if (!manifest)
            manifest = JSON.parse(
                fs
                    .readFileSync(
                        path.join(WEBPACK_OUTPUT_PATH, "manifest.json")
                    )
                    .toString("utf8")
            )
        if (baseUrl) return urljoin(baseUrl, "/assets", manifest[assetName])
        else return urljoin("/", "assets", manifest[assetName])
    }

    return urljoin(WEBPACK_DEV_URL, assetName)
}
