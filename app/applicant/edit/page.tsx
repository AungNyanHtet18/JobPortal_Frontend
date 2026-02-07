'use client'

import { useSearchParams } from "next/navigation"
import ApplicantCreateComponent from "./_client/applicant-create-form"
import ApplicantEditComponent from "./_client/applicant-edit-form"

export default function ApplicantEditPage() {

    const searchParam = useSearchParams()
    const id = searchParam.get("id")

    if(id) {
         return (
             <ApplicantEditComponent id={id} />
         )
    }


     return (
        <ApplicantCreateComponent />
     )
}