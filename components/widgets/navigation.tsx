import { Briefcase, Lock, ShoppingBag } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { nav } from "@/lib/type/navbartype";
import Link from "next/link";
import { isLogin } from "@/lib/login-users";
import { Button } from "../ui/button";
import { signOutAction } from "@/lib/actions/auth.action";

export default async function Navigation() {

   const UserisLogin: boolean = await isLogin()

    return (
      <nav className="w-full top-0 z-50 border-b px-4 py-4 bg-white/90 backdrop-blur-md flex justify-between items-center">
        <h2 className="text-2xl font-bold flex justify-between items-center gap-2">
          <Briefcase size={20} />Job Portal
        </h2>
      
        <div >
          <NavigationMenu >
              <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>

                   <NavigationMenuContent>
                        <NavigationMenuLink asChild>
                          <Link href="/products/laptop">Laptop</Link>
                        </NavigationMenuLink>

                        <NavigationMenuLink asChild>
                          <Link href="/products/phone">Phone</Link>
                        </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {nav.map(a => 
                    <NavigationMenuItem key={a.id}>
                      <NavigationMenuLink asChild>
                        <Link href={a.url}>{a.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>)}
                    

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
                        <Button onClick={signOutAction} className="flex items-center  gap-2 hover:bg-blue-900">
                            <Lock/> Sign Out
                        </Button>
                    </NavigationMenuItem> 
                  }

                  <NavigationMenuItem>
                    <ShoppingBag  size={25}/>
                  </NavigationMenuItem>
              </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    )  

}