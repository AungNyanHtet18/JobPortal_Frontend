export default function InputComponent({className, title, icon, children} : {className?: string, title: string,  icon: React.ReactNode, children: React.ReactNode}) {
     
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                {icon}
                <h2 className="text-base font-semibold">{title}</h2>
            </div>

            <div className={`grid gap-4 ${className}`}>
                {children}
            </div>
        </div>
    )
}