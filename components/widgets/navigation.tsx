import { Briefcase, ShoppingBag } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { nav } from "@/lib/type/navbartype";
import Link from "next/link";

export  function Navigation() {
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

                  <NavigationMenuItem>
                    <ShoppingBag  size={25}/>
                  </NavigationMenuItem>
              </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    )  

}