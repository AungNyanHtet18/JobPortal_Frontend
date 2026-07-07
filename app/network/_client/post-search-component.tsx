'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Heart, MessageCircle, MoreHorizontal, Pencil, Search, Send, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import FormsTextAreaInput from "@/components/fields/form-textarea"
import DialogComponent from "@/components/widgets/dialog-widget"
import Loading from "@/components/widgets/loading"
import { searchPost, createPost, updatePost } from "@/lib/actions/post/post.action"
import { PostForm, PostListItem, PostSchema } from "@/lib/type/schema/post/post.schema"
import {  getAccountPhoto, getPostPhotoForPostList, safeCall } from "@/lib/utils"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PostSearchComponent() {
    const [posts, setPosts] = useState<PostListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingPostId, setEditingPostId] = useState<number | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const form = useForm<PostForm>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            content: ""
        }
    })

    useEffect(() => {
      searchPostList(searchKeyword)
    }, [])

    async function searchPostList (keyword?: string) {
        setLoading(true)
        await safeCall(async () => {
            const data = await searchPost(keyword)
            console.log(data);
            setPosts(data || [])
        })
        setLoading(false)
    }

    const openCreateDialog = () => {
        form.reset({ content: "" })
        setEditingPostId(null)
        setSelectedImage(null)
        setPreviewImage(null)
        setDialogOpen(true)
    }

    const openEditDialog = (post: PostListItem) => {
        form.reset({ content: post.content })
        setEditingPostId(post.id)
        setSelectedImage(null)
        setPreviewImage(post.postPhoto ? getPostPhotoForPostList(post.postPhoto) : null)
        setDialogOpen(true)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    async function save(form: PostForm) {
        await safeCall(async () => {
            const formData = new FormData()
            formData.append("form", JSON.stringify(form))
            if (selectedImage) {
                formData.append("file", selectedImage)
            }

            if (editingPostId) {
                await updatePost(editingPostId, formData)
                toast.success("Post updated successfully")
            } else {
                await createPost(formData)
                toast.success("Post created successfully")
            }
            
            setDialogOpen(false)
            searchPostList(searchKeyword)
        })
    }

    if (loading && posts.length === 0) {
        return <Loading />
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6 pb-10">
            <div className="flex md:flex-row flex-col gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
                <form onSubmit={(e) => {
                        e.preventDefault()
                        searchPostList(searchKeyword)}} className="flex w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
                    <Input 
                        placeholder="Search posts" 
                        className="pl-9 bg-zinc-50  focus-visible:ring-zinc-200"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <Button type="submit" variant="ghost" className="ml-2">Search</Button>
                </form>
                <Button onClick={openCreateDialog} className="w-full sm:w-auto shrink-0 bg-zinc-900 hover:bg-zinc-800 text-white">
                    <Pencil className="size-4 mr-2" /> Create Post
                </Button>
            </div>

            <div className="space-y-6">
                {posts.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-xl border border-zinc-100">
                        <MessageCircle className="size-12 mx-auto text-zinc-300 mb-3" />
                        <h3 className="text-lg font-medium text-zinc-900">No posts found</h3>
                        <p className="text-sm text-zinc-500 mt-1">Try adjusting your search or create a new post.</p>
                    </div>
                )}
                 
                {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden border-zinc-200 shadow-sm">
                        <CardHeader className="px-3 flex flex-row items-start gap-3">
                            <Avatar className="h-10 w-10 ring-1 ring-zinc-100">
                                <AvatarImage src={post.accountPhoto ? getAccountPhoto(post.accountPhoto) : ""} alt={post.accountName} />
                                <AvatarFallback className="bg-zinc-100 text-zinc-600">
                                    {post.accountName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar> 
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-zinc-900 truncate">
                                    {post.accountName}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Posted recently
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" onClick={() => openEditDialog(post)}>
                                <Pencil className="size-4" />
                                <span className="sr-only">Edit post</span>
                            </Button>
                        </CardHeader> 
                        
                        <CardContent className="p-4 pt-2">
                            <p className="text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">
                                {post.content}
                            </p>
                            {post.postPhoto && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50">
                                    <img 
                                        src={getPostPhotoForPostList(post.postPhoto)} 
                                        alt="Post attachment" 
                                        className="w-full max-h-[500px] object-contain"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                            )}
                        </CardContent>

                        <div className="px-4 pt-5 border-t border-zinc-100 flex items-center justify-between text-zinc-500">
                            <div className="flex gap-1 items-center">
                                <Heart className="size-5 fill-zinc-400 text-zinc-400" />
                                <span className="text-sm">12</span>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <span>3 comments</span>
                            </div>
                        </div>

                        <CardFooter className="p-1 border-t border-zinc-100 flex gap-1">
                            <Button variant="ghost" className="flex-1 h-10 rounded-md text-zinc-600 cursor-pointer hover:text-zinc-900 hover:bg-zinc-100 ">
                                <Heart className="size-5 mr-2" /> Like
                            </Button>
                            <Button variant="ghost" className="flex-1 text-zinc-600 h-10 rounded-md cursor-pointer hover:text-zinc-900 hover:bg-zinc-100">
                                <MessageCircle className="size-5 mr-2" /> Comment
                            </Button>
                        </CardFooter>
                    </Card>
                ))} 

            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(save)}>
                    <DialogComponent 
                        diaLogIndex={dialogOpen ? 1 : null} 
                        diaLogTitle={editingPostId ? "Edit Post" : "Create a Post"} 
                        diaLogDescription={editingPostId ? "Update your post content and image." : "Share what's on your mind with your network."}
                        onOpenChange={() => setDialogOpen(false)}
                        onRemoveChange={() => setDialogOpen(false)}
                        saved={true}>
                        <div className="space-y-2 py-4">
                            <FormsTextAreaInput 
                                control={form.control} 
                                path="content" 
                                placeHolder="What do you want to talk about?" 
                                rowHeight="min-h-[80px] resize-none text-base border-none focus-visible:ring-0 shadow-none p-0"
                            />
                            
                            {previewImage && (
                                <div className="relative rounded-lg overflow-hidden border border-zinc-200">
                                    <img src={previewImage} alt="Preview" className="w-full h-60  object-cover" />
                                    <Button 
                                        type="button" 
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                        onClick={() => {
                                            setSelectedImage(null)
                                            setPreviewImage(null)
                                        }}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" className="text-zinc-600 rounded-full" onClick={() => document.getElementById('post-image-upload')?.click()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                        Add Photo
                                    </Button>
                                    <input 
                                        id="post-image-upload" 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageChange}/>
                                </div>
                            </div>
                        </div>
                    </DialogComponent>
                </form>
            </Form>
        </div>
    )
}