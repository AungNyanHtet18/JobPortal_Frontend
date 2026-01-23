import { AuthInput } from "@/components/widgets/authinput";
import { Key, User } from "lucide-react";

export default function Page() {
     return (
      <div className="w-1/3 flex justify-center items-center">
         <div className="flex flex-col gap-3">
          <h3 className="text-[25px] text-indigo-600 font-medium">USER SIGNIN</h3>
            <AuthInput icon={<Key/>} label="Enter your email"></AuthInput>
            <AuthInput icon={<Key/>} label="Enter your password"></AuthInput>
          </div>
       </div>
     )
}