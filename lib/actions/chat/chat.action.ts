'use server'

import { secureSearch } from "@/lib"
import { getAccessToken, getLoginUser } from "@/lib/login-users"
import { AccountFollowListItem, ChatAccountDetail, ChatConnectionInfo, ChatMessageItem, ChatRoomAccountListItem } from "@/lib/type/schema/chat/chat.schema"

export async function getChatConnectionInfo(): Promise<ChatConnectionInfo> {
    const loginUser = await getLoginUser()
    const accessToken = await getAccessToken()

    if(!accessToken) {
        throw new Error("Access token is required for chat")
    }

    return {backendUrl: `${process.env.BACKEND_URL}`, accessToken, loginUser}
}

export async function findChatMessages(recipientId: number): Promise<ChatMessageItem[]> {
    const response = await secureSearch(`chat/messages/${recipientId}`)
    return await response.json()
}

export async function searchChatRoomAccount() : Promise<ChatRoomAccountListItem[]>  {
    const response = await secureSearch('chat/chatRoom/accountList')
    return await response.json()
}

export async function searchFollowerAccount() : Promise<AccountFollowListItem[]> {
     const response = await secureSearch('chat/followList')
     return await response.json()
}

export async function findChatAccountById(id: string) : Promise<ChatAccountDetail>  {
    const response = await secureSearch(`chat/account/${id}`)
    return await response.json()
} 