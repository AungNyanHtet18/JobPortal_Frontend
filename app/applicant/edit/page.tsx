'use client'

import { findByApplicant } from "@/lib/actions/applicant/applicant.action"
import { safeCall } from "@/lib/utils"
import { useEffect, useState } from "react"
import ApplicantCreateComponent from "../_client/applicant-create-component"
import ApplicantEditComponent from "../_client/applicant-edit-component"

export default function ApplicantEditPage() {
    
       const [id, setId] = useState<string | undefined>()
    
       useEffect(() => {
           function load() {
              safeCall(async () => {
                 const result = await findByApplicant()
                 if(result) {
                     setId(result)
                 } 
                
              })
           }
           load()
       }, [])


       if(id) {
           return <ApplicantEditComponent id={id}/>
       }

    return (
        <ApplicantCreateComponent/>
     )
}