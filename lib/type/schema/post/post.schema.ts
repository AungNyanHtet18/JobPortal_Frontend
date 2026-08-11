import z from "zod";

export const PostSchema = z.object({
    content: z.string().nonempty("Please enter content for post.")
})

export type PostForm = z.infer<typeof PostSchema>;

export type PostListItem = {
    id: number
    content: string
    postPhoto: string | null
    accountId: number
    accountName: string
    accountEmail: string
    accountPhoto: string | null
    reactionCount: number
    commentCount: number
    reacted: boolean,
    createdTime: string
}

export type PostSearch = {
    keyword?: string
    username?: string
}
