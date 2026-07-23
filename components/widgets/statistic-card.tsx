import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

type StatisticCardProps = {
    title: string
    value: number
    icon: LucideIcon
    color?: "blue" | "green" | "purple" | "orange"
}

export function StatisticCard({ title, value, icon: Icon, color = "blue" }: StatisticCardProps) {
    const colorClasses = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
        orange: "text-orange-600"
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("p-4 rounded-full", colorClasses[color])}>
                    <Icon className="size-8" />
                </div>
                <div>
                    <p className="text-sm text-zinc-500 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-zinc-900">{value.toLocaleString()}</p>
                </div>
            </CardContent>
        </Card>
    )
}
