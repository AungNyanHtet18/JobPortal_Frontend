import { PageSearch } from "../.."

export type JobSearch = {
   jobLevel?: string,
   jobType?: string,
   deleted?: string,
   keyword?: string
} & PageSearch

export type JobListItem = {
   jobId: number
   positionName: string
   salary: number
   jobLevel: string
   jobType: string
   companyName: string
   location: string
   createAt: string
}

