import PageTitle from "@/components/widgets/page-title";
import SignInFormComponent from "./_client/signin-form";

export default function SignInPage() {
     return (
      <div className="w-1/3 flex justify-center items-center">
         <div className="flex flex-col gap-3 w-2/3">
             <PageTitle icon="LogIn" title="User SIGNIN" /> 
             <SignInFormComponent/>
          </div>
       </div>
     )
}