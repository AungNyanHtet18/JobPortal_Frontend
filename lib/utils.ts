import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function safeCall(action: () => Promise<void>) {
   try {
     await action()
   }catch(e: any) {
     if(e.message == "NEXT_REDIRECT") {
       return 
     }
     toast("Message", {
  description: (() => {
    if (e instanceof Error) {
      try { 
        return JSON.parse(e.message); 
       } 
      catch { 
        return e.message; 
      }
    }
      return e?.message || String(e);
      })()
     })
   }
}