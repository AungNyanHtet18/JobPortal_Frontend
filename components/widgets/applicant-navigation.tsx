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
        <h2 className="text-2xl flex justify-between items-center gap-2 text-zinc-50">
          <div className="p-2 rounded-lg bg-zinc-900">
            <Briefcase size={26} className="text-zinc-50" />
          </div>
          <span className="font-semibold space-x-2 text-shadow-md space-x-2">
            <span className="tracking-wider">J<span className="text-zinc-900">O</span>B</span>
            <span className="tracking-wider">P<span className="text-zinc-900">O</span>RTAL</span>
          </span> 
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

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link className="text-[14px] font-semibold text-zinc-100" href='/applicant/detail'>Profile</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  
                  { !UserisLogin && 
                    <>
                     <NavigationMenuItem>
                      <NavigationMenuLink className="text-[14px] font-semibold text-zinc-100" asChild>
                        <Link href={'/signup'}>SignUp</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>  

                    <NavigationMenuItem>
                      <NavigationMenuLink className="text-[14px] font-semibold text-zinc-100" asChild>
                        <Link href={'/signin'}>Sign In</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem> 
                    </>
                  }
                    <NavigationMenuItem>
                        <Button onClick={signOutAction} className="flex items-center  gap-2 hover:bg-slate-700">
                            <Lock/> Sign Out
                        </Button>
                    </NavigationMenuItem>
                  
              </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    )  

}