export type NavbarType = {
    id: number,
    name: string,
    url: string
}

export const nav: NavbarType[] = [
    {id: 1, name: "applicant", url: "/applicant"},
    {id: 2, name: "edit", url: "/applicant/edit"},
    {id: 3, name: "joblist", url: "/applicant/joblist"}]
    