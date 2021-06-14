import { Link } from "./Link"
import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartBar } from "@fortawesome/free-solid-svg-icons/faChartBar"
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile"
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload"
import { faTable } from "@fortawesome/free-solid-svg-icons/faTable"
import { faDatabase } from "@fortawesome/free-solid-svg-icons/faDatabase"
import { faGlobe } from "@fortawesome/free-solid-svg-icons/faGlobe"
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag"
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight"
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye"
import { faCoffee } from "@fortawesome/free-solid-svg-icons/faCoffee"
import { faNewspaper } from "@fortawesome/free-solid-svg-icons/faNewspaper"
import { faBook } from "@fortawesome/free-solid-svg-icons/faBook"
import { faSatelliteDish } from "@fortawesome/free-solid-svg-icons/faSatelliteDish"

export const AdminSidebar = () => (
    <aside className="AdminSidebar">
        <ul className="sidebar-menu">
            <li className="header">SITE</li>
            <li>
                <Link to="/explorers">
                    <FontAwesomeIcon icon={faCoffee} /> Explorers
                </Link>
            </li>
        </ul>
    </aside>
)
