import Navigation from "@/components/widgets/navigation";


export default async function ApplicantLayout({children} : {children: React.ReactNode}) {
     
    return (
        <div>
            <Navigation/>
            {children}
        </div>
    )
}