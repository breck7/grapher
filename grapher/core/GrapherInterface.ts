import {
    StackMode,
    GrapherTabOption,
    ScatterPointLabelStrategy,
    HighlightToggleConfig,
    RelatedQuestionsConfig,
    EntitySelectionMode,
    EntitySelection,
    ChartTypeName,
    FacetStrategy,
} from "./GrapherConstants"
import { AxisConfigInterface } from "../axis/AxisConfigInterface"
import { LegacyChartDimensionInterface } from "./LegacyVariableCode"
import { TimeBound } from "../../clientUtils/TimeBounds"
import { ComparisonLineConfig } from "../scatterCharts/ComparisonLine"
import { LogoOption } from "../captionedChart/Logos"
import { ColorScaleConfigInterface } from "../color/ColorScaleConfig"
import { MapConfigInterface } from "../mapCharts/MapConfig"
import {
    ColumnSlug,
    ColumnSlugs,
    Time,
} from "../../coreTable/CoreTableConstants"
import { EntityId, EntityName } from "../../coreTable/OwidTableConstants"
import { ColorSchemeName } from "../color/ColorConstants"
import { QueryParams } from "../../clientUtils/url"

// This configuration represents the entire persistent state of a grapher
// Ideally, this is also all of the interaction state: when a grapher is saved and loaded again
// under the same rendering conditions it ought to remain visually identical
export interface GrapherInterface {
    type?: ChartTypeName
    id?: number
    version?: number
    slug?: string
    title?: string
    subtitle?: string
    sourceDesc?: string
    note?: string
    hideTitleAnnotation?: boolean
    minTime?: TimeBound
    maxTime?: TimeBound
    timelineMinTime?: Time
    timelineMaxTime?: Time
    dimensions?: LegacyChartDimensionInterface[]
    addCountryMode?: EntitySelectionMode
    comparisonLines?: ComparisonLineConfig[]
    highlightToggle?: HighlightToggleConfig
    stackMode?: StackMode
    hideLegend?: boolean
    logo?: LogoOption
    hideLogo?: boolean
    hideRelativeToggle?: boolean
    entityType?: string
    entityTypePlural?: string
    hideTimeline?: boolean
    zoomToSelection?: boolean
    minPopulationFilter?: number
    showYearLabels?: boolean // Always show year in labels for bar charts
    hasChartTab?: boolean
    hasMapTab?: boolean
    tab?: GrapherTabOption
    overlay?: GrapherTabOption
    relatedQuestions?: RelatedQuestionsConfig[]
    internalNotes?: string
    variantName?: string
    originUrl?: string
    baseColorScheme?: ColorSchemeName
    invertColorScheme?: boolean
    hideLinesOutsideTolerance?: boolean
    hideConnectedScatterLines?: boolean // Hides lines between points when timeline spans multiple years. Requested by core-econ for certain charts
    scatterPointLabelStrategy?: ScatterPointLabelStrategy
    compareEndPointsOnly?: boolean
    matchingEntitiesOnly?: boolean
    excludedEntities?: number[]
    selectedEntityNames?: EntityName[]
    selectedEntityColors?: { [entityName: string]: string }
    selectedEntityIds?: EntityId[]
    facet?: FacetStrategy

    xAxis?: Partial<AxisConfigInterface>
    yAxis?: Partial<AxisConfigInterface>
    colorScale?: Partial<ColorScaleConfigInterface>
    map?: Partial<MapConfigInterface>

    // When we move graphers to Git, and remove dimensions, we can clean this up.
    ySlugs?: ColumnSlugs
    xSlug?: ColumnSlug
    sizeSlug?: ColumnSlug
    colorSlug?: ColumnSlug
}

export interface LegacyGrapherInterface extends GrapherInterface {
    selectedData?: EntitySelection[]
    data: any
}

export interface GrapherQueryParams extends QueryParams {
    tab?: string
    overlay?: string
    stackMode?: string
    zoomToSelection?: string
    minPopulationFilter?: string
    xScale?: string
    yScale?: string
    time?: string
    region?: string
    shown?: string
    endpointsOnly?: string
    selection?: string
}

export interface LegacyGrapherQueryParams extends GrapherQueryParams {
    year?: string
    country?: string // deprecated
}

// Another approach we may want to try is this: https://github.com/mobxjs/serializr
export const grapherKeysToSerialize = [
    "type",
    "id",
    "version",
    "slug",
    "title",
    "subtitle",
    "sourceDesc",
    "note",
    "hideTitleAnnotation",
    "minTime",
    "maxTime",
    "timelineMinTime",
    "timelineMaxTime",
    "addCountryMode",
    "highlightToggle",
    "stackMode",
    "hideLegend",
    "logo",
    "hideLogo",
    "hideRelativeToggle",
    "entityType",
    "entityTypePlural",
    "hideTimeline",
    "zoomToSelection",
    "minPopulationFilter",
    "showYearLabels",
    "hasChartTab",
    "hasMapTab",
    "tab",
    "internalNotes",
    "variantName",
    "originUrl",
    "baseColorScheme",
    "invertColorScheme",
    "hideLinesOutsideTolerance",
    "hideConnectedScatterLines",
    "scatterPointLabelStrategy",
    "compareEndPointsOnly",
    "matchingEntitiesOnly",
    "xAxis",
    "yAxis",
    "colorScale",
    "map",
    "dimensions",
    "selectedEntityNames",
    "selectedEntityColors",
    "selectedEntityIds",
    "excludedEntities",
    "comparisonLines",
    "relatedQuestions",
]
