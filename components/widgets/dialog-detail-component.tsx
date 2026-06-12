import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { IconType } from "@/lib/type/type"
import IconComponent from "./icon-component"

type DialogDetail = {
      title: string,
      titleIcon: IconType,
      onClickAction: () => void,
      children : React.ReactNode
}

export default function DialogDetailComponent({title, titleIcon, onClickAction, children} : DialogDetail) {
     return (
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
               <div className="mb-5 flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                    <div className="flex items-center gap-2">
                         <IconComponent icon={titleIcon} className="size-5 text-zinc-900"/>
                         <h2 className="text-base font-semibold">{title}</h2>
                    </div>

                    <Button type="button" variant="outline" size="sm" className="border-zinc-900 text-zinc-950 hover:bg-zinc-100" onClick={() => onClickAction()}>
                         <Plus className="size-4" />
                         Add
                    </Button>
               </div>
               {children}
          </div>

     )
}