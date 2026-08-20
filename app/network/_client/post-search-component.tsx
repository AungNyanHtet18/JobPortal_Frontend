'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, MessageCircle, Pencil, Search, SquarePen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import FormsTextAreaInput from "@/components/fields/form-textarea"
import DialogComponent from "@/components/widgets/dialog-widget"
import Loading from "@/components/widgets/loading"
import PostInteractionComponent from "@/components/widgets/post-interaction-component"
import { searchPost, createPost, updatePost, deletePost } from "@/lib/actions/post/post.action"
import { PostForm, PostListItem, PostSchema } from "@/lib/type/schema/post/post.schema"
import {  checkDateIsToday, formatDateForDay, getAccountPhoto,  getCompanyPhoto,  getPostPhotoForPostList, getTimeAgo, safeCall } from "@/lib/utils"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PageTitle from "@/components/widgets/page-title"
import { Label } from "@/components/ui/label"
import { findByLoginUser } from "@/lib/actions/auth.action"
import { LoginUser } from "@/lib/type/schema/auth.schema"
import Link from "next/link"

export default function PostSearchComponent() {
    const [posts, setPosts] = useState<PostListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingPostId, setEditingPostId] = useState<number | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [loginEmail, setLoginEmail] = useState<string>('')

    const form = useForm<PostForm>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            content: ""
        }
    })

    useEffect(() => {
      searchPostList(searchKeyword)
    }, [])

    async function searchPostList(keyword?: string) {
        setLoading(true)
        await safeCall(async () => {
            const loginUser: LoginUser = await findByLoginUser()
            const data = await searchPost(keyword)
            setLoginEmail(loginUser.email)
            setPosts(data || [])
        })
        setLoading(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
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

    async function save(form: PostForm) {
        await safeCall(async () => {
            const formData = new FormData()
            formData.append("form", JSON.stringify(form))
            
            if (selectedImage) {
                formData.append("file", selectedImage)
            }

            if (editingPostId) {
                await updatePost(editingPostId, formData)
                toast.success("Post is updated successfully")
            } else {
                await createPost(formData)
                toast.success("Post is created successfully")
            }
            
            setDialogOpen(false)
            searchPostList(searchKeyword)
        })
    }

    async function deleteDialog (postId: number | null){
        if(postId != null) {
            await safeCall(async () => {
                const result = await deletePost(postId)
                toast.success(result.id)
            })
        }

        setDialogOpen(false)
        searchPostList(searchKeyword)
    }

    if (loading && posts.length === 0) {
        return <Loading content="Loading Posts..." />
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6 pb-10">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-100 space-y-3">
                <div className="flex md:flex-row flex-col gap-4 justify-between items-center">
                    <PageTitle icon="Podcast" title="Post List" description="Share your thoughts with the community.What's on your mind?"/>
                </div>
                
                <div className=" flex md:flex-row flex-col gap-4 justify-between items-center">
                    <form onSubmit={(e) => {
                            e.preventDefault()
                            searchPostList(searchKeyword)}} className="flex w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
                        <Input 
                            placeholder="Search posts" 
                            className="pl-9 bg-zinc-50  focus-visible:ring-zinc-200"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}/>
                        <Button type="submit" variant="ghost" className="ml-2 font-medium  hover:bg-zinc-400 hover:text-zinc-50">Search</Button>
                    </form>
                    <Button onClick={openCreateDialog} className="w-full sm:w-auto shrink-0 bg-zinc-900 hover:bg-zinc-800 text-white">
                        <SquarePen className="size-4" /> Create Post
                    </Button>
                </div>
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
                            {
                                post.accountEmail === loginEmail ? 
                                <Link href= {post.accountRole === 'Applicant' ? `/applicant/detail` : `/companyaccount/detail`}>
                                    <Avatar className="h-10 w-10 ring-1 ring-zinc-100">
                                        <AvatarImage src={post.accountPhoto && post.accountRole === 'Applicant' ?  getAccountPhoto(post.accountPhoto) : 
                                                        post.accountPhoto && post.accountRole === 'CompanyAccount' ? getCompanyPhoto(post.accountPhoto)  : 
                                                        ''} alt={post.accountName} />
                                        <AvatarFallback className="bg-zinc-100 text-zinc-600">
                                            {post.accountName.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar> 
                                </Link> : 
                                <Link href= {post.accountRole === 'Applicant' ? `/job/applicant/${post.accountId}` : `/job/company/${post.accountId}`}>
                                    <Avatar className="h-10 w-10 ring-1 ring-zinc-100">
                                        <AvatarImage src={post.accountPhoto && post.accountRole === 'Applicant' ?  getAccountPhoto(post.accountPhoto) : 
                                                        post.accountPhoto && post.accountRole === 'CompanyAccount' ? getCompanyPhoto(post.accountPhoto)  : 
                                                        ''} alt={post.accountName} />
                                        <AvatarFallback className="bg-zinc-100 text-zinc-600">
                                            {post.accountName.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar> 
                                </Link> 
                            }
                            
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-zinc-900 truncate">
                                    {post.accountName} 
                                </p>
                                <p className="text-xs text-zinc-500">
                                      {checkDateIsToday(post.createdTime) ? `${getTimeAgo(post.createdTime)}` : formatDateForDay(post.createdTime)}
                                </p>
                            </div>
                            
                            {post.accountEmail === loginEmail && 
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" onClick={() => openEditDialog(post)}>
                                <Pencil className="size-4" />
                                <span className="sr-only">Edit post</span>
                            </Button>}
                        </CardHeader> 
                        
                        <CardContent className="pt-2">
                            <p className="text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">
                                {post.content} 
                            </p>
                            {post.postPhoto && (
                                <div className=" mt-3 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50">
                                    <img src={getPostPhotoForPostList(post.postPhoto)}  alt="Post attachment" 
                                        className="w-full max-h-[500px] object-contain"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}/>
                                </div>
                            )}
                        </CardContent>
                        <PostInteractionComponent postId={post.id} initialReactionCount={post.reactionCount} initialCommentCount={post.commentCount} userReacted={post.reacted}/>
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
                        onRemoveChange={() => {deleteDialog(editingPostId)}}
                        saved={true}>

                        <div className="space-y-2 py-4">
                            <FormsTextAreaInput control={form.control} path="content" 
                                placeHolder="What do you want to talk about?" 
                                rowHeight="min-h-[80px] resize-none text-base border-none focus-visible:ring-0 shadow-none p-0"/>
                            
                            {previewImage && (
                                <div className="relative rounded-lg overflow-hidden border border-zinc-200">
                                   <img src={previewImage} alt="Preview" className="w-full h-60  object-cover" />
                                    <Button type="button" variant="destructive" size="icon" 
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
                                    <Button type="button" variant="outline" size="sm" className="text-zinc-600 rounded-full" asChild>
                                        <Label htmlFor="post-image-upload" className="cursor-pointer">
                                            <ImageIcon className="size-4" />
                                             Add Photo
                                        </Label>
                                    </Button>
                                    <input id="post-image-upload" type="file"  accept="image/*" className="hidden"  onChange={handleImageChange}/>
                                </div>
                            </div>
                        </div>
                    </DialogComponent>
                </form>
            </Form>
        </div>
    )
}
