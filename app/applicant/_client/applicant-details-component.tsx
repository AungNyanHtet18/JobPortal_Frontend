'use client'

import { ApplicantDetails } from "@/lib/type/schema/applicant/applicant.schema"
import { safeCall } from "@/lib/utils"
import { useEffect, useState } from "react"
import * as applicant from "@/lib/actions/applicant/applicant.action" 
import Loading from "@/components/widgets/loading"
import { Card, CardHeader } from "@/components/ui/card"

export default function ApplicantDetailsComponent() {
    const  [details, setDetails] = useState<ApplicantDetails>()

    useEffect(() => {
          function load() {
             safeCall(async () => {
                    const result = await applicant.findByName()
                    setDetails(result) 
             })
         }

         load()

    }, [setDetails])

    if(!details) {
        return (
          <Loading />
        )
    }


    return (
         <Card className="w-full lg:w-2/3">
            <CardHeader>
                     
            </CardHeader>
         </Card> 
     )
}