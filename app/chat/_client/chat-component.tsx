'use client'

import { Client } from "@stomp/stompjs";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react"
import { MessageCircle, Search, Send, UserRound, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { findChatAccountById, findChatMessages, getChatConnectionInfo, readMessage, searchChatRoomAccount, searchFollowerAccount, unReadMessage } from "@/lib/actions/chat/chat.action"
import { AccountFollowListItem, ChatConnectionInfo, ChatMessageItem, ChatRoomAccountListItem, UnReadMessageSenderRequestList} from "@/lib/type/schema/chat/chat.schema"
import { cn, formatMessageTime, getAccountPhoto, getCompanyPhoto, getInitials, safeCall } from "@/lib/utils"

function resolveAccountPhoto(accountPhoto: string, accountRole: string): string {
  return accountRole === "CompanyAccount" ? getCompanyPhoto(accountPhoto) : getAccountPhoto(accountPhoto)
}

export default function ChatComponent({ accountId }: { accountId?: string }) {
    const [contacts, setContacts] = useState<AccountFollowListItem[]>([])
    const [selectedContact, setSelectedContact] = useState<AccountFollowListItem | null>(null)
    const [messages, setMessages] = useState<ChatMessageItem[]>([])
    const [connectionInfo, setConnectionInfo] = useState<ChatConnectionInfo | null>(null)
    const [searchKeyword, setSearchKeyword] = useState<string>("")
    const [messageText, setMessageText] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [historyLoading, setHistoryLoading] = useState<boolean>(false)
    const [connected, setConnected] = useState<boolean>(false)

    const stompClientRef = useRef<Client | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    const filteredContacts = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase()
        if (!keyword) return contacts
        return contacts.filter(contact => contact.accountName.toLowerCase().includes(keyword))
    }, [contacts, searchKeyword])

    useEffect(() => {
        async function load() {
            if(accountId){
                await chatMessageAction(accountId)
            }else {
                await chatMessageAction()
            }
        }

        load()
        
    }, [accountId])

    useEffect(() => {
        if (!connectionInfo) return

        const baseWsUrl = connectionInfo.backendUrl.replace(/^http/, "ws")
        const wsUrl = `${baseWsUrl}/ws?token=${encodeURIComponent(connectionInfo.accessToken)}`

        const client = new Client({
        brokerURL: wsUrl,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
            setConnected(true)

            // Subscribe to private queue
            client.subscribe("/user/queue/messages", (messageFrame) => {
            const message = JSON.parse(messageFrame.body) as ChatMessageItem
            setSelectedContact(currentSelected => {
                if (currentSelected &&
                    (message.senderId === currentSelected.accountId || message.recipientId === currentSelected.accountId)) {
                     setMessages(prev => (prev.some(item => item.id === message.id) ? prev : [...prev, message]))
                }
                return currentSelected
            })
             if(selectedContact?.accountId === message.senderId) {
                readMessage(message.senderId)
            }
                chatMessageAction()
            
            })
        },

        onDisconnect: () => {
            setConnected(false)
        },

        onStompError: (frame) => {
            toast.error("Chat connection error", {
            description: frame.headers["message"] || "Please reconnect and try again."
            })
        }
        })

        client.activate()
        stompClientRef.current = client

        return () => {
            client.deactivate()
            stompClientRef.current = null
        }
    }, [connectionInfo])

    // Fetch chat history on contact change
    useEffect(() => {
        if (!selectedContact) {
         setMessages([])
        return
        }
        setHistoryLoading(true)

        safeCall(async () => {
            const history = await findChatMessages(selectedContact.accountId)
            setMessages(history)
        }).finally(() => setHistoryLoading(false))
    }, [selectedContact])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    async function chatMessageAction(accountId?: string) {
      await  safeCall(async () => {
        let contactList: AccountFollowListItem[] = []
        const followList = await searchFollowerAccount()
        const chatRoomAccountList = await searchChatRoomAccount()

        if (accountId) {
            const currentChatAccount = await findChatAccountById(accountId)
            contactList = [currentChatAccount]
        }

        contactList = [...contactList, ...followList, ...chatRoomAccountList].filter(
            (item, index, self) => index === self.findIndex(t => t.accountId === item.accountId))

        const info = await getChatConnectionInfo()
        
        if(contactList.length > 0) {
            contactList.forEach(contact => {contact.unReadMessage=false})
            const unReadMessageSenderRequest: UnReadMessageSenderRequestList[] = contactList.map(contact => ({senderId: contact.accountId}))
            const unReadMessageSenderList = await unReadMessage(unReadMessageSenderRequest)
            if(unReadMessageSenderList.id.length > 0) {
                unReadMessageSenderList.id.forEach(unRead => {
                    const account = contactList.find(contact => contact.accountId === unRead.senderId)
                    if(account) {
                        account.unReadMessage = true
                    }
                })
            }
        }

        setContacts(contactList)
        //setSelectedContact(contactList[0] ?? null)
        setConnectionInfo(info)
        }).finally(() => setLoading(false))
    } 

        async function readChatMessage(contact: ChatRoomAccountListItem) {
         await  safeCall(async () => {
           await readMessage(contact.accountId)
           await chatMessageAction()
         })

         setSelectedContact(contact)
         
    }

    function sendMessage(event?: FormEvent<HTMLFormElement>) {
        event?.preventDefault()
        const content = messageText.trim()

        if (!content || !selectedContact) return

        if (!stompClientRef.current || !stompClientRef.current.connected) {
            toast.error("Chat is not connected yet")
            return
        }

            stompClientRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify({
                recipientId: selectedContact.accountId,
                content
            })
        })

        setMessageText("")
    }

    function handleMessageKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
        }
    }

    if(loading) {
        return (
            <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm">
                <div className="text-center">
                    <MessageCircle className="mx-auto mb-3 size-10 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-600">Preparing your conversations...</p>
                </div>
            </div>
        )
    }

    return (
      <div className="mx-auto grid h-full min-h-0  max-w-7xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
            <aside className="flex flex-col border border-b border-zinc-200 bg-zinc-50 overflow-hidden ">
                <div className="border-b border-zinc-200 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-semibold text-zinc-900">Messages</h1>
                            <p className="text-sm text-zinc-500">Chat with followed accounts</p>
                        </div>
                        <span className={cn(
                            "size-9 items-center justify-center rounded-md",
                            connected ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                        )}>
                            {connected ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
                        </span>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-3 size-4  text-zinc-400" />
                        <Input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)}
                            placeholder="Search follow accounts"
                            className="h-10 bg-zinc-50 pl-9 focus-visible:ring-zinc-200" />
                    </div>
                </div>

                <div className="flex-1 h-full overflow-hidden p-3 ">
                    {filteredContacts.length === 0 && (
                        <div className="mt-16 text-center">
                            <UserRound className="mx-auto mb-3 size-10 text-zinc-300" />
                            <p className="text-sm font-medium text-zinc-700">No follow accounts found</p>
                            <p className="mt-1 text-xs text-zinc-500">Follow an applicant or company to start chatting.</p>
                        </div>
                    )}

                    {filteredContacts.length > 0 && (
                    <div className="space-y-2 h-full overflow-y-scroll">
                        {filteredContacts.map(contact => {
                            const selected = selectedContact?.accountId === contact.accountId
                            return (
                                <button key={contact.accountId} type="button"
                                    onClick={async () => {await readChatMessage(contact)}}
                                    className={cn("flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                                        selected
                                            ? "border-zinc-50 bg-slate-500 text-white shadow-sm"
                                            : "border-transparent bg-white text-zinc-900 hover:border-zinc-200 hover:bg-zinc-100"
                                    )}>
                                    <Avatar className="size-11 ring-1 ring-zinc-200">
                                        {contact.accountPhoto && <AvatarImage src={resolveAccountPhoto(contact.accountPhoto, contact.accountRole )} alt={contact.accountName} className="object-cover" /> } 
                                        <AvatarFallback className={selected ? "bg-zinc-700 text-white" : "bg-zinc-100 text-zinc-600"}>
                                            {getInitials(contact.accountName)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="truncate text-sm font-semibold">{contact.accountName}</p>
                                                <p className={cn("truncate text-xs", selected ? "text-zinc-300" : "text-zinc-500")}>
                                                    {contact.accountRole === "CompanyAccount" ? "Company account" : "Applicant account"}
                                                </p>
                                            </div>
                                            {contact.unReadMessage === true && 
                                                <div>
                                                    <div className="size-3 border-2 border-zinc-300 rounded-full bg-zinc-900"></div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div> )}
                </div>
            </aside>

            <section className="flex flex-col bg-white overflow-hidden">
                {selectedContact ? (
                    <>
                        <div className="flex items-center justify-between gap-4 border-b bg-slate-500 border-zinc-200 px-4 py-3">
                            <div className="flex  items-center gap-3">
                                <Avatar className="size-11 ring-1 ring-zinc-200">
                                    {selectedContact.accountPhoto && <AvatarImage src={resolveAccountPhoto(selectedContact.accountPhoto, selectedContact.accountRole )} alt={selectedContact.accountName} className="object-cover"/> } 
                                    <AvatarFallback className="bg-zinc-100 text-zinc-200">
                                        {getInitials(selectedContact.accountName)}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <h2 className="truncate text-base font-semibold text-zinc-100">{selectedContact.accountName}</h2>
                                    <p className="text-xs text-zinc-200">
                                        {connected ? "Connected" : "Connecting"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 bg-zinc-50 px-2 py-5 overflow-hidden">
                            {historyLoading ? (
                                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                                    Loading chat history...
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex h-full items-center justify-center">
                                    <div className="text-center">
                                        <MessageCircle className="mx-auto mb-3 size-12 text-zinc-300" />
                                        <h3 className="text-base font-semibold text-zinc-800">Start the conversation</h3>
                                        <p className="mt-1 text-sm text-zinc-500">Send the first message to {selectedContact.accountName}.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 overflow-y-scroll px-2 h-full ">
                                    {messages.map(message => {
                                        const isMine = message.senderId !== selectedContact.accountId
                                        return (
                                            <div key={message.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                                                <div className={cn("max-w-[78%] rounded-lg px-4 py-3 shadow-sm",
                                                    isMine
                                                        ? "bg-slate-500 text-white"
                                                        : "border border-zinc-200 bg-white text-zinc-900"
                                                )}>
                                                    <p className="whitespace-pre-wrap break-words text-base leading-6">{message.content}</p>
                                                    <p className={cn("mt-2 text-xs", isMine ? "text-zinc-300" : "text-zinc-500")}>
                                                        {formatMessageTime(message.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={bottomRef} /> 
                                </div>
                            )}
                        </div>

                        <form onSubmit={sendMessage} className="border-t border-zinc-200 bg-zinc-900 p-4">
                            <div className="flex items-center gap-3">
                                <Textarea value={messageText}
                                    onChange={(event) => setMessageText(event.target.value)}
                                    onKeyDown={handleMessageKeyDown} placeholder={`Message ${selectedContact.accountName}`}
                                    className="max-h-32 min-h-11 flex-1 resize-none rounded-lg bg-zinc-50 focus-visible:ring-zinc-200" />
                                <Button type="submit" size="icon-lg" disabled={!messageText.trim() || !connected}
                                    className="h-11 w-11 bg-slate-500 text-white hover:bg-slate-600 mb-1">
                                    <Send className="size-5" />
                                    <span className="sr-only">Send message</span>
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center bg-zinc-50">
                        <div className="text-center">
                            <MessageCircle className="mx-auto mb-3 size-12 text-zinc-300" />
                            <h2 className="text-lg font-semibold text-zinc-900">Select an account</h2>
                            <p className="mt-1 text-sm text-zinc-500">Choose a followed account from the left sidebar to chat.</p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}
