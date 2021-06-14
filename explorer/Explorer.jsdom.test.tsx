#! yarn testJest

import { Explorer } from "./Explorer"
import { SampleExplorer } from "./Explorer.sample"

import { configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import { GrapherTabOption } from "../grapher/core/GrapherConstants"
configure({ adapter: new Adapter() })

describe(Explorer, () => {
    const title = "AlphaBeta"
    const element = mount(SampleExplorer())
    it("renders", () => {
        expect(element.find(".ExplorerHeaderBox").text()).toContain(
            "CO₂ Data Explorer"
        )
        expect(element.find(`.HeaderHTML`).text()).toContain(title)
        expect(element.find(`.loading-indicator`).length).toEqual(0)
        expect(element.text()).toContain("Kingdom")
    })

    it("recovers country selection from URL params", () => {
        const element = mount(
            SampleExplorer({ uriEncodedPatch: "selection~Ireland" })
        )
        const explorer = element.instance() as Explorer
        expect(explorer.selection.selectedEntityNames).toEqual(["Ireland"])
    })
})
