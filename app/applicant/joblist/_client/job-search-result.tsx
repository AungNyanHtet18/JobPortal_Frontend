// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { JobListItem } from "@/lib/type/schema/applicant/applicant.schema";

// export default function JobSearchResult({list} : {list : JobListItem[]}) {

//     if(list.length ==  0) {
//          return (
//             <div>
//                 <h1>No Data</h1>
//             </div>
//          )
//     }

//     return (
//         <Table>
//             <TableHeader>
//                 <TableRow>
//                     <TableHead>Job ID</TableHead>
//                     <TableHead>Position Name</TableHead>
//                     <TableHead>Salary</TableHead>
//                     <TableHead>Job Level</TableHead>
//                     <TableHead>Job Type</TableHead>
//                     <TableHead>Company Name</TableHead>
//                     <TableHead>Location</TableHead>
//                     <TableHead>Create At</TableHead>
//                 </TableRow>
//             </TableHeader>

//             <TableBody>
//                 {list.map((item,index) => 
//                     <TableRow key={index}>
//                         <TableCell>{item.jobId}</TableCell>
//                         <TableCell>{item.positionName}</TableCell>
//                         <TableCell>{item.salary}</TableCell>
//                         <TableCell>{item.jobLevel}</TableCell>
//                         <TableCell>{item.jobType}</TableCell>
//                         <TableCell>{item.companyName}</TableCell>
//                         <TableCell>{item.location}</TableCell>
//                         <TableCell>{item.createAt}</TableCell>
//                     </TableRow>)}
//             </TableBody>
//         </Table>
//     )

// }