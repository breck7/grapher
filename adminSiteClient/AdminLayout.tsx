import * as React from "react"
import { observable, action, computed } from "mobx"
import { observer } from "mobx-react"

import { Link } from "./Link"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    DefaultNewExplorerSlug,
    EXPLORERS_ROUTE_FOLDER,
} from "../explorer/ExplorerConstants"

@observer
export class AdminLayout extends React.Component<{
    title?: string
    children: any
}> {
    render() {
        return (
            <div className={"AdminLayout"}>
                <nav className="navbar navbar-dark bg-dark flex-row navbar-expand-lg">
                    <Link className="navbar-brand" to="/">
                        List
                    </Link>
                    <Link
                        className="navbar-brand"
                        to={`${EXPLORERS_ROUTE_FOLDER}/${DefaultNewExplorerSlug}`}
                    >
                        Create
                    </Link>
                </nav>
                {this.props.children}
            </div>
        )
    }
}
