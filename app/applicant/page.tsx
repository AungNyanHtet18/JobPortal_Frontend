'use client'
import PageTitle from "@/components/widgets/page-title"
import {Cursor, useTypewriter} from 'react-simple-typewriter'

export default function ApplicantPage() {

   const [text] = useTypewriter({
       words: ['Job Portal', 'Job Finder', 'Job Platform'],
       loop: true,
       typeSpeed: 200,
       delaySpeed: 20
   })


   return (
      <section className="py-4">
         <PageTitle icon="User" title="Applicant"/>

         <h1 className="text-2xl">
            This app is  {' '}
            <span className="font-semibold text-blue-400">
               {text}
            </span>
            <span className="text-red-600">
               <Cursor cursorStyle='|'/>
            </span>
         </h1>

      </section>
   )
}