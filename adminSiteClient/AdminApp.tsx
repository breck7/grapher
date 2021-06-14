import * as React from "react"
import { Admin } from "./Admin"
import { action } from "mobx"
import { observer } from "mobx-react"
import { ImportPage } from "./ImportPage"
import { NotFoundPage } from "./NotFoundPage"
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom"
import { LoadingBlocker, Modal } from "./Forms"
import { AdminAppContext } from "./AdminAppContext"
import { Base64 } from "js-base64"
import { ExplorerCreatePage } from "../explorerAdmin/ExplorerCreatePage"
import { ExplorersIndexPage } from "../explorerAdmin/ExplorersListPage"
import { EXPLORERS_ROUTE_FOLDER } from "../explorer/ExplorerConstants"
import { AdminLayout } from "./AdminLayout"

@observer
class AdminErrorMessage extends React.Component<{ admin: Admin }> {
    render() {
        const { admin } = this.props
        const error = admin.errorMessage

        return error ? (
            <Modal
                className="errorMessage"
                onClose={action(() => {
                    error.isFatal
                        ? window.location.reload()
                        : (admin.errorMessage = undefined)
                })}
            >
                <div className="modal-header">
                    <div>
                        <h5
                            className="modal-title"
                            style={error.isFatal ? { color: "red" } : undefined}
                        >
                            {error.title}
                        </h5>
                        {error.isFatal && (
                            <p>
                                Please screenshot this error message and report
                                it in{" "}
                                <a href="https://owid.slack.com/messages/tech-issues/">
                                    #tech-issues
                                </a>
                            </p>
                        )}
                    </div>
                </div>
                <div className="modal-body">
                    <pre dangerouslySetInnerHTML={{ __html: error.content }} />
                </div>
            </Modal>
        ) : null
    }
}

@observer
class AdminLoader extends React.Component<{ admin: Admin }> {
    render() {
        const { admin } = this.props
        return admin.showLoadingIndicator ? <LoadingBlocker /> : null
    }
}

@observer
export class AdminApp extends React.Component<{
    admin: Admin
    gitCmsBranchName: string
}> {
    get childContext() {
        return { admin: this.props.admin }
    }

    render() {
        const { admin, gitCmsBranchName } = this.props

        return (
            <AdminAppContext.Provider value={this.childContext}>
                <Router basename={admin.basePath}>
                    <div className="AdminApp">
                        <AdminErrorMessage admin={admin} />
                        <AdminLoader admin={admin} />
                        <Switch>
                            <Route
                                exact
                                path={`/${EXPLORERS_ROUTE_FOLDER}/:slug`}
                                render={({ match }) => (
                                    <AdminLayout title="Create Explorer">
                                        <ExplorerCreatePage
                                            slug={match.params.slug}
                                            gitCmsBranchName={gitCmsBranchName}
                                            manager={admin}
                                        />
                                    </AdminLayout>
                                )}
                            />
                            <Route
                                exact
                                path={`/${EXPLORERS_ROUTE_FOLDER}`}
                                render={({ match }) => (
                                    <AdminLayout title="Explorers">
                                        <ExplorersIndexPage />
                                    </AdminLayout>
                                )}
                            />
                            <Route
                                exact
                                path="/"
                                render={() => <Redirect to="/explorers" />}
                            />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </div>
                </Router>
            </AdminAppContext.Provider>
        )
    }
}
