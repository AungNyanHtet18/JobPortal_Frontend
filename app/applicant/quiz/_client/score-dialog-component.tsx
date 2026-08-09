'use client'

import { AlertDialog } from "@/components/ui/alert-dialog"
import PageDetailComponent from "@/components/widgets/page-detail-component"

type ScoreDialogProps = {
    open: boolean
    passed: boolean | null
    totalMarks: number
    totalPossibleMarks: number
    onClose: () => void
}

export function ScoreDialog({open, passed, totalMarks, totalPossibleMarks, onClose }: ScoreDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={nextOpen => { if (!nextOpen) onClose()}}
            title={passed ? "Assessment Completed" : "Assessment Scored"}
            description={passed ? "Great job! You cleared the passing score threshold for this interview practice quiz." : "Your score has been calculated. Review the highlighted answers to improve for the next attempt."}
            actionText="Review Answers" cancelText="Close"
            onConfirm={onClose} loading={false}>

            <div className="space-y-3">
                <PageDetailComponent title="Total Marks" icon="Trophy">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                            <p className="text-xs text-zinc-500">Your Score</p>
                            <p className="mt-1 text-2xl font-bold text-zinc-900">{totalMarks}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                            <p className="text-xs text-zinc-500">Maximum</p>
                            <p className="mt-1 text-2xl font-bold text-zinc-900">{totalPossibleMarks}</p>
                        </div>
                        <div className={`rounded-xl border p-4 text-center ${
                                passed ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                            }`}>
                            <p className={`text-xs ${passed ? "text-green-700" : "text-red-700"}`}>Status</p>
                            <p className={`mt-1 text-2xl font-bold ${passed ? "text-green-800" : "text-red-800"}`}>
                                {passed ? "PASSED" : "NEEDS REVIEW"}
                            </p>
                        </div>
                    </div>
                </PageDetailComponent>
            </div>
        </AlertDialog>
    )
}