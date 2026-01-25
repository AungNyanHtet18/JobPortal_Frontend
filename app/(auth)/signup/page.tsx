import { Metadata } from "next"
import SignUpFormComponent from "./_client/signup-form"
import PageTitle from "@/components/widgets/page-title"

export const metadata: Metadata =   {
     title: "Job Portal | Sign Up",
     description: "Home Page of Job Portal"
}

export default function SignUpPage() {

     return (
       <div className="w-1/3 flex justify-center items-center">
         <div className="flex flex-col gap-3 w-2/3">
            <PageTitle icon="UserPlus" title="User SIGNUP" /> 
            <SignUpFormComponent />
          </div>
       </div>
     )
}