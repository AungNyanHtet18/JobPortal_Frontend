export type Pager = {
    page: number
    size: number
    totalCount: number
    totalPage: number
    links: number[]
}

export type PageResult<T> = {
     contents: T[]
} & Pager


export type ModificationResult<T> = {
     id : T
}

export type PageSearch = {
     page?: number
     size?: number
}

export const DEFAULT_PAGE_RESULT: PageResult<any> = {
    contents: [],
    page: 0,
    size: 0,
    totalCount: 0,
    totalPage: 0,
    links: []
}
