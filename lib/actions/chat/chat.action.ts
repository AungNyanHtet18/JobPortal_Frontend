'use server'

import { POST_CONFIG, secureRequest, secureSearch } from "@/lib"
import { getAccessToken, getLoginUser } from "@/lib/login-users"
import { ModificationResult } from "@/lib/type"
import { AccountFollowListItem, ChatAccountDetail, ChatConnectionInfo, ChatMessageItem, ChatRoomAccountListItem, UnReadMessageSenderListItem, UnReadMessageSenderRequestList } from "@/lib/type/schema/chat/chat.schema"

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

export async function unReadMessage(unReadMessageSenderRequestList: UnReadMessageSenderRequestList[]) : Promise<ModificationResult<UnReadMessageSenderListItem[]>>  {
    const response = await secureRequest('chat/unreadMessage', { 
        ...POST_CONFIG,
        body: JSON.stringify(unReadMessageSenderRequestList)
    })
    return await response.json() as ModificationResult<UnReadMessageSenderListItem[]>
}