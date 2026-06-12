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

export function getCompanyPhotoForJobList(profileImage: string):  string  {
   return `http://localhost:8081/companyprofile/${encodeURIComponent(profileImage)}`
}

export  function formatDate(value: string | null): string {
    if (value === null) {
        return "Not added"
    }

    const dateValue = value as string //eg. date value = 2022-01-01 
    const date: Date = new Date(dateValue) // date = Sat Jan 01 2022 06:30:00 GMT+0630

    return new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric"
    }).format(date)  //format date = Jan 2022
  }