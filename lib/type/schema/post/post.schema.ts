import z from "zod";

export const PostSchema = z.object({
    content: z.string().nonempty("Please enter content for post.")
});

export type PostForm = z.infer<typeof PostSchema>;

export type PostListItem = {
    id: number;
    content: string;
    postPhoto: string | null;
    accountName: string;
    accountPhoto: string | null;
};

export type PostSearch = {
    keyword?: string;
};
