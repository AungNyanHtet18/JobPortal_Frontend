export type NavbarType = {
    id: number,
    name: string,
    url: string
}

export const applicantNavbar: NavbarType[] = [
    {id: 1, name: "applicant", url: "/applicant"},
    {id: 2, name: "edit", url: "/applicant/edit"},
    {id: 3, name: "joblist", url: "/applicant/joblist"}]

export const companyNavbar: NavbarType[] = [
    {id: 1, name: "company", url: "/companyaccount"},
    {id: 2, name: "create", url: "/companyaccount/edit"}]

export const companyAuthNavbar: NavbarType[] = [
    {id: 1, name: "detail", url: "/companyaccount/detail"},
    {id: 2, name: "job", url: "/companyaccount/job"}]

    