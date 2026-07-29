export default function ContentLayout({title, icon, children} : {title: string, icon: React.ReactNode, children : React.ReactNode}) {
 
    return (
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    {icon}
                    <h2 className="text-base font-semibold">{title}</h2>
                </div>
                {children}
            </div>
    )
}