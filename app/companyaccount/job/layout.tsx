import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Portal | Job Page",
    description: "Company Feature  of Job Portal Page"
};

export default function Layout({children} : {children : React.ReactNode}) {
    return (
        <>{children}</>
    )
}