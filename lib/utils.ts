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
     toast.error("Message", {
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
export function getAccountPhoto(postImage: string) : string {
   return `http://localhost:8081/profile/${encodeURIComponent(postImage)}`
}

export function getCompanyPhoto(profileImage: string) :  string  {
   return `http://localhost:8081/companyprofile/${encodeURIComponent(profileImage)}`
}

export function getPostPhotoForPostList(postImage: string) : string {
   return `http://localhost:8081/postphoto/${encodeURIComponent(postImage)}`
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

export  function formatDateTime(value: string | null): string {
    if (value === null) {
        return "Not added"
    }

    const dateValue = value as string //eg. date value = 2022-01-01 
    const date: Date = new Date(dateValue) // date = Sat Jan 01 2022 06:30:00 GMT+0630
    const day = getOrdinal(date.getDate())

    const month = new Intl.DateTimeFormat("en", {
        month: "short",
    }).format(date)  //format date = Jan 2022
  
    const year = date.getFullYear()

    return `${day} ${month} ${year}`
  }

function getOrdinal(day: number): string {
   if(day > 3 && day <21) return `${day}th`
   
   switch(day % 10) {
     case 1: 
          return `${day}st`
     case 2:
          return `${day}nd`
     case 3:
          return `${day}rd`
     default:
          return `${day}th` 
    }
}

export function checkDateIsToday(day: string) : boolean {
   const createdDate = new Date(day)
   const today = new Date()

   return (
     createdDate.getFullYear() === today.getFullYear() &&
     createdDate.getMonth() === today.getMonth() && 
     createdDate.getDate() === today.getDate()
   )
}

export function getTimeAgo(day: string): string {
  const createdDate = new Date(day);
  const now = new Date();

  const diffMs = now.getTime() - createdDate.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days !== 1 ? "s" : ""} ago`;
}