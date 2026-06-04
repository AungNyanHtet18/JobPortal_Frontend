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


export function formatFileSize(size: number) {
    if(size < 1024 * 1024) {
        return `${Math.max(1, Math.round(size / 1024))} KB`
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`
}


export function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(item => item[0]?.toUpperCase())
        .join("") || "AP"
}

export function getFileName(fileName: string | null) {
    if(!fileName) {
        return "No resume uploaded"
    }

    const normalized = fileName.split(/[\\/]/).pop() || fileName   //Extracts only the actual file name E.g C:\upload\resume\cv.pdf to cv.pdf

    try {
        return decodeURIComponent(normalized)
    } catch {
        return normalized
    }
}
