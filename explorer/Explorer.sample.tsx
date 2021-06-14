import React from "react"
import { GrapherProgrammaticInterface } from "../grapher/core/Grapher"
import {
    DimensionProperty,
    GrapherTabOption,
} from "../grapher/core/GrapherConstants"
import { Explorer, ExplorerProps } from "./Explorer"

const SampleExplorerProgram = `explorerTitle\tCO₂ Data Explorer
explorerSubtitle\tDownload the complete <i>Our World in Data</i> <a href="https://github.com/owid/co2-data">CO₂ and GHG Emissions Dataset</a>.
subNavId\tco2
time\tearliest..latest
selection\tChina\tUnited States\tIndia\tUnited Kingdom\tWorld
Gas Radio\tCO₂
Accounting Radio\tProduction-based
subNavCurrentId\tco2-data-explorer
graphers
\tgrapherId\tGas Radio\tAccounting Radio\tFuel Dropdown\tCount Dropdown\tRelative to world total Checkbox
\t488\tCO₂\tProduction-based\tTotal\tPer country\tfalse
\t3219\tCO₂\tProduction-based\tTotal\tPer country\tShare of global emissions
\t486\tCO₂\tProduction-based\tTotal\tPer capita
\t485\tCO₂\tProduction-based\tTotal\tCumulative\tfalse
\t3218\tCO₂\tProduction-based\tTotal\tCumulative\tShare of global emissions
\t4267\tCO₂\tProduction-based\tTotal\tPer MWh of energy
\t530\tCO₂\tProduction-based\tTotal\tPer $ of GDP
\t3621\tCO₂\tConsumption-based\t\tPer country
\t3488\tCO₂\tConsumption-based\t\tPer capita
\t4331\tCO₂\tConsumption-based\t\tPer $ of GDP
\t696\tCO₂\tConsumption-based\t\tShare of emissions embedded in trade
\t4250\tCO₂\tProduction-based\tCoal\tPer country
\t4251\tCO₂\tProduction-based\tOil\tPer country
\t4253\tCO₂\tProduction-based\tGas\tPer country
\t4255\tCO₂\tProduction-based\tCement\tPer country
\t4332\tCO₂\tProduction-based\tFlaring\tPer country
\t4249\tCO₂\tProduction-based\tCoal\tPer capita
\t4252\tCO₂\tProduction-based\tOil\tPer capita
\t4254\tCO₂\tProduction-based\tGas\tPer capita
\t4256\tCO₂\tProduction-based\tCement\tPer capita
\t4333\tCO₂\tProduction-based\tFlaring\tPer capita
\t4147\tAll GHGs (CO₂eq)\tProduction-based\t\tPer country
\t4239\tAll GHGs (CO₂eq)\tProduction-based\t\tPer capita
\t4222\tMethane\tProduction-based\t\tPer country
\t4243\tMethane\tProduction-based\t\tPer capita
\t4224\tNitrous oxide\tProduction-based\t\tPer country
\t4244\tNitrous oxide\tProduction-based\t\tPer capita`

export const SampleExplorer = (props?: Partial<ExplorerProps>) => {
    const title = "AlphaBeta"
    const first = {
        id: 488,
        title,
        dimensions: [
            {
                variableId: 142609,
                property: DimensionProperty.y,
            },
        ],
        tab: GrapherTabOption.chart,
        owidDataset: {
            variables: {
                "142609": {
                    years: [-1, 0, 1, 2],
                    entities: [1, 2, 1, 2],
                    values: [51, 52, 53, 54],
                    id: 142609,
                    display: { zeroDay: "2020-01-21", yearIsDay: true },
                },
            },
            entityKey: {
                "1": { name: "United Kingdom", code: "GBR", id: 1 },
                "2": { name: "Ireland", code: "IRL", id: 2 },
            },
        },
    }
    return (
        <Explorer slug="test-slug" program={SampleExplorerProgram} {...props} />
    )
}
