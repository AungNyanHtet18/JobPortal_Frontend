import { LoginUser } from "../auth.schema"

export type ChatMessageItem = {
    id: number
    roomId: number
    senderId: number
    senderName: string
    senderEmail: string
    recipientId: number
    recipientName: string
    recipientEmail: string
    content: string
    createdAt: string | null
}

export type ChatConnectionInfo = {
    backendUrl: string
    accessToken: string
    loginUser: LoginUser
}

export type ChatRoomAccountListItem = {
     accountId: number
     accountName: string
     accountPhoto: string | null
     accountRole: 'Applicant' | 'CompanyAccount' | 'Admin',
     unReadMessage: boolean
}

export type AccountFollowListItem = ChatRoomAccountListItem

export type ChatAccountDetail = ChatRoomAccountListItem

export type UnReadMessageSenderRequestList = {
    senderId: number
}

export type UnReadMessageSenderListItem = {
    senderId: number
}

