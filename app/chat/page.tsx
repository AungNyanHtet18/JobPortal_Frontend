'use client'
import { useParams, useSearchParams } from "next/navigation";
import ChatComponent from "./_client/chat-component";

export default function ChatPage() {
    const searchParams = useSearchParams();
    const accountId = searchParams.get("accountId");

    if(accountId) {
        return <ChatComponent accountId={accountId} /> 
    }

    return (<ChatComponent/>)
}