'use client'

import { CompanyForm, CompanySchema } from "@/lib/type/schema/company/company.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function CompanyCreateComponent() {
     
    const router = useRouter()

    const form = useForm<CompanyForm>({
         resolver: zodResolver(CompanySchema),
         defaultValues: {
             companyName: "",
             location: "",
             phone: "",
             websiteUrl: "",
             description: ""
         }
    })

    return (
        <h1>Create Company Component</h1>
    )
}