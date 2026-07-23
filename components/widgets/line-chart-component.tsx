'use client'

import { ChartLine } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area} from "recharts"

type LineChartProps = {
    data: { date: string; value: number }[]
    title: string
    color?: string
}

export function LineChartComponent({ data, title, color = "#64748B" }: LineChartProps) {
    return (
        <div className="w-full h-full flex flex-col ">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-zinc-800">
                <ChartLine className="size-6" />{title}
            </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            
                        <XAxis dataKey="date"
                                tick={{ fontSize: 12, fill: "#71717a" }}
                                tickFormatter={(date) => {
                                const parts = date.split("-")

                                if (parts.length === 3 && parts[2] === "01") {
                                    return parts[1]
                                }
                                return parts[2]}}/>

                        <YAxis  domain={[0, "dataMax"]} padding={{ top: 0, bottom: 0 }} tick={{ fontSize: 12, fill: "#71717a" }}/>

                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: "#fff", 
                                border: "1px solid #e4e4e7",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                            }} 
                        />
                        <Legend/>
                        
                        <Area type="linear" dataKey="value" stroke="#000000" fill="#000000" fillOpacity={0.6} name="Job Posts"/>

                    </AreaChart>
                </ResponsiveContainer>
        </div>
    )
}
