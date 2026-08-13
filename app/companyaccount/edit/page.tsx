'use client'
import CompanyCreateComponent from "@/app/companyaccount/_client/company-create-component"
import { findByCompany } from "@/lib/actions/company/company.action"
import { safeCall } from "@/lib/utils"
import { useEffect, useState } from "react"
import CompanyEditComponent from "../_client/company-edit-component"

export default function CompanyEditPage() {
   
   const [id, setId] = useState<string | undefined>()

   useEffect(() => {
       function load() {
          safeCall(async () => {
             const result = await findByCompany()
             if(result) {
                 setId(result)
             } 
          })
       }

       load()
   }, [])

   if(id) {
       return <CompanyEditComponent id={id}/>
   }


     return (
        <CompanyCreateComponent/>
     )
}
