export type NavbarType = {
    id: number,
    name: string,
    url: string
}

export const nav: NavbarType[] = [
    {id: 1, name: "login", url: "/signin"},
    {id: 2, name: "register", url: "/signup"},
    {id: 3, name: "user", url: "/user"},]