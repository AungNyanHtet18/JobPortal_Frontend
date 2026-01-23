import { Lock } from "lucide-react"

type AuthInput = {
    icon: React.ReactNode
    label: string
    type?: string
}


export function AuthInput({icon, label, type} : AuthInput) {
     return (
        <div className="flex items-center gap-2 border rounded-md bg-gray-100 py-3 px-2 w-75">
             <Lock size={30} className="text-indigo-400"/>
            <input type={type || 'text'} className="caret-blue-600 text-lg outline-none" placeholder={label === '' ? 'Enter your Name' : label}/>
        </div>
     )
}