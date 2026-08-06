'use client'

import { Button } from "@/components/ui/button"
import IconComponent from "@/components/widgets/icon-component"
import { getQuizTitles} from "@/lib/actions/quiz/quiz.action"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { QuizTitleListItem } from "@/lib/type/schema/quiz/quiz.schema"
import { safeCall } from "@/lib/utils"
import { ChevronRight, Loader2, SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

export default function QuizSearchComponent() {
    const [result, setResult] = useState<PageResult<QuizTitleListItem>>(DEFAULT_PAGE_RESULT) 
    const [isLoading, setIsLoading] = useState<boolean>(false)

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
        setIsLoading(true)
        await search(0, result.pageInfo.totalCount) //search(0 = page, size = result.pageInfo.totalCount)
        setIsLoading(false)
    }

    return (
        <div className="space-y-6 bg-zinc-50">
            <div className="flex justify-between">
                <header className="flex items-center gap-2 mb-4">
                    <IconComponent icon="Brain" className="size-6 text-zinc-500" />
                    <h1 className="tracking-wider text-xl text-zinc-500 font-[600]">Interview Quizzes by Role</h1>
                </header>
            
                <Button className='bg-slate-500 text-white hover:bg-slate-600 shadow-md rounded-lg' onClick={fetchAllQuizzes}>
                    {isLoading ? 'Loading' : 'View All Roles' } 
                    {isLoading ?  <Loader2 className="size-4 animate-spin" /> : <ChevronRight className="size-4"/>} 
                </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 px-6">
                {result.list.map((quiz) => 
                <Link href={`/applicant/quiz/${quiz.quizId}`} key={quiz.quizId}>
                    <div className="group min-h-36 bg-slate-500 flex justify-between items-start border border-zinc-200 rounded-md p-3 shadow-md transition duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-110 cursor-pointer">
                        <div className="flex flex-col flex-1 gap-2">
                            <h4 className="tracking-wide text-lg text-zinc-900 font-semibold text-shadow-xs">{quiz.roleName}</h4>
                            <h5 className="text-sm text-zinc-50 font-medium tracking-wide text-wrap">{quiz.quizTitle.length > 45 ? `${quiz.quizTitle.slice(0, 45)} ...` : quiz.quizTitle}</h5>
                            <span className="text-zinc-900 text-xs mt-4">{quiz.quizQuestionCount} {quiz.quizQuestionCount > 1 ? 'Questions' : 'Question'}</span>
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