#! /usr/bin/env jest

import { ExplorerProgram } from "../explorer/ExplorerProgram"
import { ExplorerAdminServer } from "./ExplorerAdminServer"

it("can init", async () => {
    const server = new ExplorerAdminServer(__dirname, "https://example.com")
    server.verbose = false
    expect(server).toBeTruthy()

    expect(
        await server.renderExplorerPage(
            new ExplorerProgram("foo", "explorerTitle helloWorld")
        )
    ).toContain("helloWorld")

    const allExplorersResult = await server.getAllExplorersCommand()
    expect(allExplorersResult.success).toBeTruthy()
})
