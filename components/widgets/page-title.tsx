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
    editUrl} :  
    {icon : IconType,
     title: string,
     subTitle?: string[],
     description?: string,
     editUrl?: string  
    }) {

    if(subTitle) {
        return (
        <header className="flex items-center gap-2 mb-2">
                <div>
                    <IconComponent icon={icon} className="size-7 text-gray-700"/>
                </div>
                <div>   
                    <div className="text-xl font-medium">{title}</div>
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
                       <Button asChild>
                            <Link href={editUrl}>
                               <Pencil/> Edit
                            </Link>
                       </Button>
                    </div>
                }
        </header>
        ) 
    }


    return (
        <header className="flex items-center gap-2 mb-4">
                <div>
                    <IconComponent icon={icon} className="size-7 text-gray-700"/>
                </div>
                <div>   
                    <div className="text-xl font-medium">{title}</div>
                    {description &&  <div className="text-muted-foreground text-1xl">{description}</div>}
                </div>

                {editUrl && 
                    <div className="ml-auto">
                       <Button asChild>
                            <Link href={editUrl}>
                               <Pencil/> Edit
                            </Link>
                       </Button>
                    </div>
                }
        </header>
    )
}