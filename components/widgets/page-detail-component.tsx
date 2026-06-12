import { IconType } from "@/lib/type/type";
import IconComponent from "./icon-component";

export default function PageDetailComponent({title, icon  , children} : {title: string, icon: IconType , children: React.ReactNode}) {
     return (
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                    <IconComponent icon={icon} className="size-5 text-zinc-900"/> 
                    <h2 className="text-base font-semibold">{title}</h2>
                </div>
                {children}
           </div>
     )
}