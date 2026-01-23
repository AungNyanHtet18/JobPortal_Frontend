import { AuthInput } from "@/components/widgets/authinput";
import { Key, Lock, User } from "lucide-react";

export default function Page() {
     return (
       <div className="w-1/3 flex justify-center items-center">
         <div className="flex flex-col gap-3">
          <h3 className="text-[25px] text-indigo-600 font-medium">USER SIGNUP</h3>
            <AuthInput icon={<Key/>} label="Enter your name"></AuthInput>
            <AuthInput icon={<Key/>} label="Enter your email" type="email"></AuthInput>
            <AuthInput icon={<Key/>} label="Enter your password" type="password"></AuthInput>
          </div>
       </div>
     )
}