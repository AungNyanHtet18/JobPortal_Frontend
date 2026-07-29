'use client'

import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "../ui/native-select"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { PageInfo } from "@/lib/type"

type PagerProps = {
     pager?: PageInfo,
     onPageChange: (page: number) => void
     onSizeChange: (size: number) => void
}

export default function PagerWidget({pager, onPageChange, onSizeChange} : PagerProps) {

    if(pager) {
        
        return (
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div>Page Size</div>
               <NativeSelect onChange={e => onSizeChange(Number.parseInt(e.target.value))}>
                    <NativeSelectOptGroup >
                        <NativeSelectOption value={10}>10</NativeSelectOption>
                        <NativeSelectOption value={20}>20</NativeSelectOption>
                        <NativeSelectOption value={30}>30</NativeSelectOption>
                    </NativeSelectOptGroup>
               </NativeSelect>

                <div className="flex justify-center gap-2">
                    <Button variant={'outline'} disabled={pager.page == 0} onClick={() => onPageChange(0)}> 
                        <ArrowLeft/>
                    </Button>
                    
                    {pager.links?.map(a => 
                     <Button key={a.toString()} variant={pager.page == a ? 'default' : 'outline'} onClick={()=> onPageChange(a)}> 
                        {a+1}
                    </Button>
                    )}

                    <Button variant={'outline'} disabled={pager.page == pager.totalPage-1} onClick={() => onPageChange(pager.totalPage -1)}>
                        <ArrowRight/>
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <LabelForPagination title="Page" value={pager.totalPage} />
                <LabelForPagination title="Count" value={pager.totalCount} />
            </div>
         </nav>)
    }

    return (<></>)

}


function LabelForPagination({title, value, className} : {title: string, value: any, className?: string}) {
    return(
     <div className="flex items-center gap-2">
        <div className="text-nowrap">{title}</div>
        <Input readOnly={true} value={value} className={cn("text-center", className ? className : 'w-16')} />
     </div>
    )
}