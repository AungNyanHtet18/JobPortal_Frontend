'use server'

import { secureSearch } from "@/lib";
import { PageResult } from "@/lib/type";
import { AdminAccountListItem, AdminAllAccountSearch, AdminApplicantListItem, AdminApplicantSearch, AdminCompanyListItem, AdminCompanySearch, AdminJobListItem, AdminJobSearch, AdminPostListItem, AdminPostSearch } from "@/lib/type/schema/admin/management.schema";

export async function searchAllAccounts(form: AdminAllAccountSearch ): Promise<PageResult<AdminAccountListItem>> {
     const response = await secureSearch("admin/account", form)
     return await response.json() as PageResult<AdminAccountListItem>
}

export async function searchApplicants(form: AdminApplicantSearch): Promise<PageResult<AdminApplicantListItem>> {
    const response = await secureSearch("admin/applicant", form)
    return await response.json() as PageResult<AdminApplicantListItem>
}

export async function searchCompanies(form: AdminCompanySearch): Promise<PageResult<AdminCompanyListItem>> {
    const response = await secureSearch("admin/company", form)
    return await response.json() as PageResult<AdminCompanyListItem>
}

export async function searchJobs(form: AdminJobSearch): Promise<PageResult<AdminJobListItem>> {
    const response = await secureSearch("admin/job", form)
    return await response.json() as PageResult<AdminJobListItem>
}