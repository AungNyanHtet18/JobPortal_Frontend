import { Key, User } from "lucide-react";

export default function Page() {
     return (
       <div className="w-1/3 flex justify-center items-center">
         <div className="flex flex-col gap-2">
          <h3 className="text-[25px] text-indigo-600 text-center font-medium">USER LOGIN</h3>
          <div className="flex items-center border rounded-md py-2 px-2">
            <User size={20} className="text-indigo-200"/>
            <input type="text" className="outline-none"/>


          </div>


          </div>
       </div>
     )
}