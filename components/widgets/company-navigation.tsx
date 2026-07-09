import { getCompanyId, isLogin } from "@/lib/login-users"
import { Briefcase, Lock } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu"
import Link from "next/link"
import { Button } from "../ui/button"
import { signOutAction } from "@/lib/actions/auth.action"
import { companyAuthNavbar, companyNavbar} from "@/lib/type/navbartype"

export default async function CompanyNavigation() {

   const UserisLogin: boolean = await isLogin()
   const companyId: string | undefined = await getCompanyId() 

    return (
      <nav className="w-full top-0 z-50 border-b px-4 py-4 bg-slate-500 backdrop-blur-md flex justify-between items-center sticky">
        <h2 className="text-2xl flex justify-between items-center gap-2 text-zinc-50">
          <div className="p-2 rounded-lg bg-zinc-900">
            <Briefcase size={26} className="text-zinc-50" />
          </div>
          <span className="font-semibold space-x-2 text-shadow-md space-x-2">
            <span className="tracking-wider">J<span className="text-zinc-900">O</span>B</span>
            <span className="tracking-wider">PORTAL</span>
          </span> 
        </h2>
      
        <div >
          <NavigationMenu >
              <NavigationMenuList>

                  {companyNavbar.map(a => 
                    <NavigationMenuItem key={a.id}>
                      <NavigationMenuLink asChild>
                        <Link className="text-[14px] font-semibold text-zinc-100" href={a.url}>{a.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>)}

                  {companyAuthNavbar.map(a => 
                    <NavigationMenuItem key={a.id}>
                      <NavigationMenuLink asChild>
                        <Link className="text-[14px] font-semibold text-zinc-100" href={a.url}>{a.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>)}

                  { !UserisLogin && 
                  <>
                     <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link  className="text-[14px] font-semibold text-zinc-100" href={'/signup'}>signup</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>  
                  
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link  className="text-[14px] font-semibold text-zinc-100" href={'/signin'}>signin</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem> 
                  </>
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