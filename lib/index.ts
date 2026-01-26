'server only'

export async function publicRequest(path: string, options : RequestInit={}, search? : {[key: string] : any}) {
     const response = await fetch(url(path, search), options)

     if(!response.ok) {
         const message = await response.json()
         throw JSON.stringify(message)
     }

     return response
}


function url(path: string, search?: {[key:string]: any}) {
    const url = new URL(`${process.env.BACKEND_URL}/${path}`)

    if(search) {
         url.search = new URLSearchParams(search).toString()
    }

    return url.toString()
}

export const POST_CONFIG:RequestInit = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    }
}

export const PUT_CONFIG:RequestInit = {
    method: 'PUT',
    headers: {
         "Content-Type": "application/json"
    }
}