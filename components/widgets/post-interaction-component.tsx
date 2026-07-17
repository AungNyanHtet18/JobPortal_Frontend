'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Heart, Loader2, MessageCircle, SendHorizontal, ThumbsUp } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createCommentPost, findCommentPost } from "@/lib/actions/post/post.comment.action"
import { reactPost, unreactPost } from "@/lib/actions/post/post.react.action"
import { CommentListItem, PostCommentForm, PostCommentSchema } from "@/lib/type/schema/post/post.comment.schema"
import { cn, getAccountPhoto, getInitials, safeCall } from "@/lib/utils"
import FormsTextAreaInput from "../fields/form-textarea"

type PostInteractionComponentProps = {
    postId: number
    initialReactionCount: number
}

export default function PostInteractionComponent({postId, initialReactionCount}: PostInteractionComponentProps) {
    const [commentOpen, setCommentOpen] = useState(false)
    const [commentLoading, setCommentLoading] = useState(false)
    const [commentSubmitting, setCommentSubmitting] = useState(false)
    const [reactLoading, setReactLoading] = useState(false)
    const [reacted, setReacted] = useState(false)
    const [reactionCount, setReactionCount] = useState(initialReactionCount || 0)
    const [comments, setComments] = useState<CommentListItem[]>([])

    const commentForm = useForm<PostCommentForm>({
        resolver: zodResolver(PostCommentSchema),
        defaultValues: {
            comment: ""
        }
    })

    async function toggleCommentBox() {
        //Find Comment List
        const loadComments = async ()=> {
            setCommentLoading(true)
            await safeCall(async () => {
                const data = await findCommentPost(postId)
                setComments(data || [])
            })
            setCommentLoading(false)
        }

        const nextOpen = !commentOpen

        setCommentOpen(nextOpen)
    
         if(nextOpen) {
            await loadComments()
        }
    }

    async function toggleReact() {
        setReactLoading(true)
        await safeCall(async () => {
            if(reacted) {
                await unreactPost(postId)
                setReacted(false)
                setReactionCount(value => Math.max(0, value - 1))
            } else {
                await reactPost(postId)
                setReacted(true)
                setReactionCount(value => value + 1)
            }
        })
        setReactLoading(false)
    }

    async function submitComment(form: PostCommentForm) {
        setCommentSubmitting(true)
        await safeCall(async () => {
            await createCommentPost(postId, form)
            commentForm.reset({comment: ""})
            const data = await findCommentPost(postId)
            setComments(data || [])
            toast.success("Comment is added successfully")
        })
        setCommentSubmitting(false)
    }

    return (
        <>
            <div className="px-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-zinc-500">
                <div className="flex gap-1.5 items-center">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-blue-900 text-white">
                        <Heart className="size-3 fill-white text-white" />
                    </span>
                    <span className="text-sm">{reactionCount}</span>
                </div>
                <button
                    type="button"
                    className="text-sm hover:text-zinc-900"
                    onClick={toggleCommentBox}>
                    {`${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
                </button>
            </div>

            <CardFooter className="p-1 border-t border-zinc-100 flex gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    disabled={reactLoading}
                    onClick={toggleReact}
                    className={cn(
                        "flex-1 h-10 rounded-md cursor-pointer hover:bg-zinc-100",
                        reacted ? "text-blue-900 hover:text-blue-950" : "text-zinc-600 hover:text-zinc-900"
                    )}>
                    {reactLoading ? <Loader2 className="size-5 mr-2 animate-spin" /> : <ThumbsUp className={cn("size-5 mr-2", reacted && "fill-blue-600 ")} />}
                    {reacted ? "Liked" : "Like"}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    onClick={toggleCommentBox}
                    className={cn(
                        "flex-1 h-10 rounded-md cursor-pointer hover:bg-zinc-100",
                        commentOpen ? "text-blue-600 hover:text-blue-900" : "text-zinc-600 hover:text-zinc-900"
                    )}>
                    <MessageCircle className="size-5 mr-2" /> Comment
                </Button>
            </CardFooter>

            {commentOpen && (
                <div className="border-t border-zinc-100 bg-zinc-50/70 px-4 py-4">
                    <Form {...commentForm}>
                        <form onSubmit={commentForm.handleSubmit(submitComment)} className="flex items-start gap-2">
                            <Avatar className="size-8 ring-1 ring-zinc-100 mt-2">
                                <AvatarFallback className="bg-zinc-200 text-xs text-zinc-600">You</AvatarFallback>
                            </Avatar>
                            <div className="relative flex-1">
                                <FormsTextAreaInput control={commentForm.control} path="comment" placeHolder="Add a comment ... " className="min-h-11 resize-none rounded-3xl border-zinc-200 bg-white py-3 pl-4 pr-15 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-blue-200" />
                                <Button
                                    type="submit"
                                    size="icon-sm"
                                    disabled={commentSubmitting}
                                    className="h-10 w-10 absolute top-2/5 right-2 rounded-full bg-blue-900 text-white hover:bg-blue-950">
                                    {commentSubmitting ? <Loader2 className="size-4 animate-spin" /> : <SendHorizontal className="size-4" />}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <div className="mt-4 space-y-3">
                        {commentLoading && (
                            <div className="flex items-center justify-center py-5 text-sm text-zinc-500">
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Loading comments
                            </div>
                        )}

                        {!commentLoading && comments.length === 0 && (
                            <p className="py-4 text-center text-sm text-zinc-500">No comments yet.</p>
                        )}

                        {!commentLoading && comments.map((comment, index) => (
                            <div key={`${comment.accountName}-${index}`} className="flex items-start gap-2">
                                <Avatar className="size-8 ring-1 ring-zinc-100">
                                    <AvatarImage src={comment.accountPhoto ? getAccountPhoto(comment.accountPhoto) : ""} alt={comment.accountName} />
                                    <AvatarFallback className="bg-zinc-200 text-xs text-zinc-600">
                                        {getInitials(comment.accountName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="max-w-[calc(100%-2.5rem)] rounded-2xl border border-zinc-100 bg-white px-3 py-2 shadow-sm">
                                    <p className="text-xs font-semibold text-zinc-900">{comment.accountName}</p>
                                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-700">{comment.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}