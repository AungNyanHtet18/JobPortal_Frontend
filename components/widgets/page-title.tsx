import { IconType } from "@/lib/type/type";
import IconComponent from "./icon-component";
import { Button } from "../ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "../ui/badge";

export default function PageTitle({
    icon,
    title,
    subTitle,
    description,
    editUrl,
    editName,
    currentRoute,
    nextRoute} :  
    {icon : IconType,
     title: string,
     subTitle?: string[],
     description?: string,
     editUrl?: string,
     editName?: string
     currentRoute?: string,
     nextRoute?: string
    }) {

    if(subTitle) {
        return (
        <header className="flex items-center gap-2 mb-2">
            <div>
                <IconComponent icon={icon} className="size-6 text-zinc-500"/>
            </div>
            <div>   
                <h1 className="tracking-wider text-xl text-zinc-500 font-[600]">{title}</h1>
                {subTitle.length > 0 && 
                    <div className="flex gap-2">
                        {subTitle.map((item,index) =>
                            <Badge key={index}>{item}</Badge>
                        )}
                    </div>                    
                }

                {description &&  <div className="text-muted-foreground text-1xl">{description}</div>}
            </div>

            {editUrl && 
            <div className="ml-auto">
                <Button className='bg-slate-500 text-white hover:bg-slate-600 shadow-md rounded-lg'  asChild>
                    <Link href={editUrl}>
                         {editName}
                    </Link>
                </Button>
            </div>
            }

            {currentRoute && nextRoute &&
            <div className="ml-auto flex space-x-1">
                <div className="text-slate-500 font-bold">
                    {currentRoute}
                </div> 
                <div className="text-zinc-800">/</div>
                <div className="text-zinc-500">
                    {nextRoute}
                </div> 
            </div>
            }
        </header>
        ) 
    }


    return (
        <header className="flex items-center gap-2 mb-4">
            <div>
                <IconComponent icon={icon} className="size-6 text-zinc-500"/>
            </div>
            <div>   
                <h1 className="tracking-wider text-xl text-zinc-500 font-[600]">{title}</h1>
                {description &&  <div className="text-muted-foreground text-1xl">{description}</div>}
            </div>

            {editUrl && 
            <div className="ml-auto">
                <Button className='bg-slate-500 text-white hover:bg-slate-600 shadow-md rounded-lg'  asChild>
                    <Link href={editUrl}>
                        {editName}
                    </Link>
                </Button>
            </div>
            }

            {currentRoute && nextRoute &&
            <div className="ml-auto flex space-x-1">
                <div className="text-slate-500 font-bold">
                    {currentRoute}
                </div> 
                <div className="text-zinc-800">/</div>
                <div className="text-zinc-500">
                    {nextRoute}
                </div> 
            </div>
            } 
        </header>
    )
}