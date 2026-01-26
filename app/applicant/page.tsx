'use client'

import { LoginUser } from "@/lib/type/schema/auth.schema";
import { useEffect, useState } from "react";
import test from "./_client/test";

export default function ApplicantPage() {

   const [user,setUser] = useState<LoginUser | undefined>(undefined)


   useEffect(()=> {

     async function load() {
         const response = await test()
         setUser(response)
      }

      load()
   },[])
   

     return (
        <div>
          <div>{user?.name}</div>
           <div>{user?.email}</div>
           <div>{user?.role}</div>
        </div>
     )
}