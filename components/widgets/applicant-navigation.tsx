import { Briefcase, Lock, ShoppingBag } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { applicantNavbar} from "@/lib/type/navbartype";
import Link from "next/link";
import { getApplicantId, isLogin } from "@/lib/login-users";
import { Button } from "../ui/button";
import { signOutAction } from "@/lib/actions/auth.action";

export default async function ApplicantNavigation() {

   const UserisLogin: boolean = await isLogin()
   const applicantId: string | undefined = await getApplicantId() 

    return (
      <nav className="w-full top-0 z-50 border-b px-4 py-4 bg-slate-500 backdrop-blur-md flex justify-between items-center sticky">
        <h2 className="text-2xl text-white font-bold flex justify-between items-center gap-2">
          <Briefcase size={20} />Job Portal
        </h2>
      
        <div >
          <NavigationMenu >
              <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-[13px]">Apply List</NavigationMenuTrigger>

                   <NavigationMenuContent>
                        <NavigationMenuLink asChild>
                          <Link href="/applicant/detail">Applied List</Link>
                        </NavigationMenuLink>

                        <NavigationMenuLink asChild>
                          <Link href="/apply">Interview List</Link>
                        </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {applicantNavbar.map(a => 
                    <NavigationMenuItem key={a.id}>
                      <NavigationMenuLink asChild>
                        <Link className="text-[14px] font-semibold text-zinc-100" href={a.url}>{a.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>)}

                  {applicantId &&
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link className="text-[14px] font-semibold text-zinc-100" href='/applicant/detail'>detail</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  }

                  { !UserisLogin && 
                     <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link href={'/signup'}>signup</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>  

                  }


                  { !UserisLogin && 
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link href={'/signin'}>signin</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem> 
                  }


                  { UserisLogin && 
                    <NavigationMenuItem>
                        <Button onClick={signOutAction} className="flex items-center  gap-2 hover:bg-slate-700">
                            <Lock/> Sign Out
                        </Button>
                    </NavigationMenuItem> 
                  }


              </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    )  

}