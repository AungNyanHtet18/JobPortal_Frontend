'use server'

import { getLoginUser } from "@/lib/login-users";
import { LoginUser } from "@/lib/type/schema/auth.schema";
import { safeCall } from "@/lib/utils";

export default async function test() : Promise<LoginUser>{
    
        let response! : LoginUser; //Force ts to trust you

        await  safeCall(async () => {
            response =  await getLoginUser() as LoginUser;
            
        })

        return response

}