'use client'

import { Activity, BarChart2, BarChart3, BarChartBigIcon, BarChartHorizontal, ChartColumn } from "lucide-react";
import {BarChart, Bar, XAxis,YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface BarChartProps {
    data: { date: string; value: number }[]
    title: string
    color?: string
}

export function BarChartComponent({ data, title, color = "#123456" }: BarChartProps) {
    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-zinc-800">
                <Activity className="size-6" /> {title}
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#71717a" }} 
                            tickFormatter={(date) => {
                                const parts = date.split("-")
                                if (parts.length === 3 && parts[2] === "01") {
                                    return parts[1]
                                }
                                return parts[2] }} />

                    <YAxis tick={{ fontSize: 12, fill: "#71717a" }} tickFormatter={(value) => Math.floor(value).toString()}/>

                    <Tooltip contentStyle={{ backgroundColor: "#fff", 
                            border: "1px solid #e4e4e7",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"}}/>

                    <Legend/>
                    
                    <Bar dataKey="value" 
                         fill={color} 
                         radius={[4, 4, 0, 0]} 
                         name="User Registrations"/>
                         
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
