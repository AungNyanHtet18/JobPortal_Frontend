'use server';

import { secureSearch } from "@/lib";
import { PageResult } from "@/lib/type";
import { AdminApplicantListItem, AdminApplicantSearch, AdminCompanyListItem, AdminCompanySearch } from "@/lib/type/schema/admin/account-management.action";

export async function searchApplicants(form: AdminApplicantSearch): Promise<PageResult<AdminApplicantListItem>> {
    const response = await secureSearch("admin/applicant", form)
    return await response.json() as PageResult<AdminApplicantListItem>
}

export async function searchCompanies(form: AdminCompanySearch): Promise<PageResult<AdminCompanyListItem>> {
    const response = await secureSearch("admin/company", form)
    return await response.json() as PageResult<AdminCompanyListItem>
}
