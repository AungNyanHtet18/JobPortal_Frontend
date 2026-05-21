'use client'
import CompanyCreateComponent from "@/app/companyaccount/_client/company-create-component"
import { useState } from "react"


export default function CompanyEditPage() {
     
    const [id, setId] = useState<string | undefined>()

   
     return (
        <CompanyCreateComponent/>
     )
}