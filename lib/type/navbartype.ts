export type NavbarType = {
    id: number,
    name: string,
    url: string
}

export const applicantNavbar: NavbarType[] = [
    {id: 1, name: "Applicant", url: "/applicant"},
    {id: 2, name: "Edit", url: "/applicant/edit"},
    {id: 3, name: "Joblist", url: "/applicant/joblist"}]

export const companyNavbar: NavbarType[] = [
    {id: 1, name: "Company", url: "/companyaccount"},
    {id: 2, name: "Edit", url: "/companyaccount/edit"},
    {id: 3, name: "Profile", url: "/companyaccount/detail"}]

export const companyAuthNavbar: NavbarType[] = [
    {id: 1, name: "Job", url: "/companyaccount/job/edit"}]

    