export type NavbarType = {
    id: number,
    name: string,
    url: string
}

export const nav: NavbarType[] = [
    {id: 1, name: "user", url: "/user"},
    {id: 2, name: "about", url: "/about"},
    {id: 3, name: "contact", url: "/contact"}]
    