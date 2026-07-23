export type DashboardForm = {
    type: 'Yearly' | 'Monthly'
    year: string
    month?: string
}

export type YearMonthData = {
    type: 'Yearly' | 'Monthly'
    year: number
    month?: number
}

export type JobPostProgressTrend = {
    [date: string]: number
}

export type UserRegistrationTrend = {
    [date: string]: number
}
