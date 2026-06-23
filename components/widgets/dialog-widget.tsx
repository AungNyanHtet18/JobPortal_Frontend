import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

type DialogProps = {
     diaLogIndex : number | null
     diaLogTitle: string
     diaLogDescription: string
     children: React.ReactNode
     onOpenChange: () => void
     onRemoveChange: (index: number | null) => void
     saved?:boolean
}

export default function DialogComponent({diaLogIndex, diaLogTitle, diaLogDescription, children, onOpenChange, onRemoveChange, saved} : DialogProps) {
     
    return (
        <Dialog open={diaLogIndex !== null} onOpenChange={(open) => !open &&  onOpenChange()}>
            <DialogContent className="max-w-2xl">
                {diaLogIndex !== null && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{diaLogTitle}</DialogTitle>
                            <DialogDescription>{diaLogDescription}</DialogDescription>
                        </DialogHeader>

                        {children}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onRemoveChange(diaLogIndex)}>
                                <Trash className="size-4" />
                                Remove
                            </Button>
                            
                            {saved ? 
                            (<Button type="submit" className="bg-zinc-950 text-white hover:bg-zinc-800">Submit</Button>
                            ): (
                              <DialogClose asChild>
                                <Button type="button" className="bg-zinc-950 text-white hover:bg-zinc-800">Done</Button>
                              </DialogClose> )}
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}