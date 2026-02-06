import PageTitle from "@/components/widgets/page-title";
import JobSearchComponent from "./_client/job-search-component";

export default function JobListPage() {
     return (
        <section>
            <PageTitle icon="GraduationCap" title="Job List"/>
            <JobSearchComponent/>
        </section>
     )
}