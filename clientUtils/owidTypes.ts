// todo: remove when we ditch Year and YearIsDay
export const EPOCH_DATE = "2020-01-21"

export interface Box {
    x: number
    y: number
    width: number
    height: number
}

export type Integer = number
export enum SortOrder {
    asc = "asc",
    desc = "desc",
}

export type Year = Integer
export type Color = string

/**
 * A concrete point in time (year or date). It's always supposed to be a finite number, but we
 * cannot enforce this in TypeScript.
 */
export type Time = Integer
export type TimeRange = [Time, Time]

export type PrimitiveType = number | string | boolean
export type ValueRange = [number, number]

export enum ScaleType {
    linear = "linear",
    log = "log",
}

export interface RelatedChart {
    title: string
    slug: string
    variantName?: string | null
}

export type LegacyVariableId = Integer // remove.

export interface FormattedPost {
    id: number
    postId?: number
    type: WP_PostType
    slug: string
    path: string
    title: string
    subtitle?: string | null
    supertitle?: string | null
    date: Date
    modifiedDate: Date
    lastUpdated?: string | null
    authors: string[]
    byline?: string | null
    info?: string | null
    html: string
    footnotes: string[]
    references: Record<string, unknown>[]
    excerpt: string
    imageUrl?: string
    tocHeadings: { text: string; slug: string; isSubheading: boolean }[]
    relatedCharts?: RelatedChart[]
}

export enum SubNavId {
    about = "about",
    coronavirus = "coronavirus",
    co2 = "co2",
    energy = "energy",
}

export interface FormattingOptions {
    toc?: boolean
    hideAuthors?: boolean
    bodyClassName?: string
    subnavId?: SubNavId
    subnavCurrentId?: string
    raw?: boolean
    [key: string]: string | boolean | undefined
}

export interface GitCommit {
    author_email: string
    author_name: string
    body: string
    date: string
    hash: string
    message: string
}

export interface SerializedGridProgram {
    slug: string
    program: string
    lastCommit?: GitCommit
}

export interface TocHeading {
    text: string
    html?: string
    slug: string
    isSubheading: boolean
}

// todo; remove
export interface PostRow {
    id: number
    title: string
    slug: string
    type: WP_PostType
    status: string
    content: string
    published_at: Date | null
    updated_at: Date
}

export interface EntryMeta {
    slug: string
    title: string
    excerpt: string
    kpi: string
}

export interface CategoryWithEntries {
    name: string
    slug: string
    entries: EntryMeta[]
    subcategories: CategoryWithEntries[]
}

export enum WP_PostType {
    Post = "post",
    Page = "page",
}

export enum PageType {
    Entry = "ENTRY",
    SubEntry = "SUBENTRY",
    Standard = "STANDARD",
}

export interface EntryNode {
    slug: string
    title: string
    // in some edge cases (entry alone in a subcategory), WPGraphQL returns
    // null instead of an empty string)
    excerpt: string | null
    kpi: string
}

export interface DocumentNode {
    id: number
    title: string
    slug: string
    content: string | null // if content is empty
}

export interface CategoryNode {
    name: string
    slug: string
    pages: any
    children: any
}

export interface PostReference {
    id: number
    title: string
    slug: string
}

export interface FullPost {
    id: number
    type: WP_PostType
    slug: string
    path: string
    title: string
    subtitle?: string
    date: Date
    modifiedDate: Date
    authors: string[]
    content: string
    excerpt?: string
    imageUrl?: string
    postId?: number
    relatedCharts?: RelatedChart[]
    glossary: boolean
}

// Exception format that can be easily given as an API error
export class JsonError extends Error {
    status: number
    constructor(message: string, status?: number) {
        super(message)
        this.status = status || 400
    }
}

export enum DeployStatus {
    queued = "queued",
    pending = "pending",
    // done = "done"
}

export interface DeployChange {
    timeISOString?: string
    authorName?: string
    authorEmail?: string
    message?: string
}

export interface Deploy {
    status: DeployStatus
    changes: DeployChange[]
}
