export type PageInfo = {
    page: number
    size: number
    totalCount: number
    totalPage: number
    links: number[]
}

export type PageResult<T> = {
     list: T[]
     pageInfo: PageInfo
}

export type ModificationResult<T> = {
     id : T
}

export type PageSearch = {
     page?: number
     size?: number
}

export const DEFAULT_PAGE_RESULT: PageResult<any> = {
    list: [],
    pageInfo: {
    page: 0,
    size: 0,
    totalCount: 0,
    totalPage: 0,
    links: []
    }
}


export const DummyPage: PageInfo = {
    page: 1,
    size: 20,
    totalCount: 40,
    totalPage: 2,
    links: [0,1]
}
