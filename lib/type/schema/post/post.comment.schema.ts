import z from "zod";

export const PostCommentSchema = z.object({
    comment: z.string().trim().nonempty("Please fill the comment for post.")
});

export type PostCommentForm = z.infer<typeof PostCommentSchema>;

export type CommentListItem = {
    comment: string;
    accountName: string;
    accountPhoto: string | null;
};
