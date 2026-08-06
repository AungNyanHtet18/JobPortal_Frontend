'use client'

import { Button } from "@/components/ui/button"
import IconComponent from "@/components/widgets/icon-component"
import { getQuizTitles} from "@/lib/actions/quiz/quiz.action"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { QuizTitleListItem } from "@/lib/type/schema/quiz/quiz.schema"
import { safeCall } from "@/lib/utils"
import { ChevronRight, ClipboardCheck, FileQuestion, NotebookPen, SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

export default function QuizSearchComponent() {
    const [result, setResult] = useState<PageResult<QuizTitleListItem>>(DEFAULT_PAGE_RESULT) 

    const search =  useCallback(async (page: number, size: number) => {
        await safeCall(async () => {
            const data = await getQuizTitles({page: page, size: size})
            setResult(data)
        })
    },[])

    useEffect(() => {
        search(0, 16)    
    }, [search])

    const fetchAllQuizzes = async () => {
        search(0, result.pageInfo.totalCount) //search(0 = page, size = result.pageInfo.totalCount)
    }

    return (
        <div className="space-y-6 bg-zinc-50">
            <div className="sticky top-10 z-10">
                <div className="flex justify-between">
                    <header className="flex items-center gap-2 mb-4">
                        <IconComponent icon="Brain" className="size-6 text-zinc-500" />
                        <h1 className="tracking-wider text-xl text-zinc-500 font-[600]">Interview Quizzes by Role</h1>
                    </header>
                
                    <Button className='bg-slate-500 text-white hover:bg-slate-600 shadow-md rounded-lg' onClick={fetchAllQuizzes}>
                        View All Roles <ChevronRight />
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 px-6">
                {result.list.map((quizTitle, index) => 
                <Link href={`/applicant/quiz/1`} key={index}>
                    <div className="group min-h-36 bg-slate-500 flex justify-between items-start border border-zinc-200 rounded-md p-3 shadow-md transition duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-110 cursor-pointer">
                            <div className="h-full flex flex-col gap-2">
                                <h4 className="tracking-wide text-zinc-900 font-semibold">{quizTitle.careerRoleName}</h4>
                                <h5 className="text-sm text-zinc-50 font-medium tracking-wide text-wrap">{quizTitle.quizTitle} </h5>
                                <span className="text-zinc-900 text-xs mt-auto">{quizTitle.quizQuestionCount} {quizTitle.quizQuestionCount > 1 ? 'Questions' : 'Question'}</span>
                            </div>
                            <div>
                                <SquareArrowOutUpRight size={20} className="text-zinc-900" />
                            </div>
                    </div>
                </Link>

                )}
            </div>  
        </div>      
    )
}