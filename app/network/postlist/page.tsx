import PageTitle from "@/components/widgets/page-title";
import PostSearchComponent from "../_client/post-search-component";

export default function PostListPage() {
     return (
        <section>
            <PageTitle icon="Podcast" title="Post List" description="Share your thoughts with the community.What's on your mind?"/>
            <PostSearchComponent/>
        </section>
     )
}