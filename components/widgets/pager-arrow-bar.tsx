import { PageInfo } from "@/lib/type"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PagerArrowProps = {
    pager?: PageInfo,
    onPageChange: (page: number) => void
}

export default function PagerArrowWidget({pager, onPageChange} : PagerArrowProps) {
    
    if(pager && pager.totalPage > 1) {
        return (
            <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-zinc-500">
                    Showing page {pager.page + 1} of {pager.totalPage}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={pager.page === 0} onClick={() => onPageChange(pager.page - 1)}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={pager.page + 1 >= pager.totalPage} onClick={() => onPageChange(pager.page + 1)}>
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        )} 
    
    return (<></>)
}