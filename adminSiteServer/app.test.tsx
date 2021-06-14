import { OwidAdminApp } from "./app"

describe(OwidAdminApp, () => {
    const app = new OwidAdminApp({ gitCmsDir: "", quiet: true })

    it("should be able to create an app", () => {
        expect(app).toBeTruthy()
    })

    it("should be able to start the app", async () => {
        const server = await app.startListening(8765, "localhost", false)
        expect(server).toBeTruthy()
        server.close()
    })
})
