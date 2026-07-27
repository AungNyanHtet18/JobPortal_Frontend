import * as lucideIcons from 'lucide-react'

export type IconType =  keyof typeof lucideIcons

export type OptionItem = {
     key: string 
     value: string
}

export const RoleOptions: OptionItem[] = [
     {key: "Applicant", value: "Applicant "},
     {key: "CompanyAccount", value: "Company"}
] 

export const JobLevel: OptionItem[] = [
     {key: "Intern Level", value: "Intern"},
     {key: "Entry Level", value: "Entry Level"},
     {key: "Junior Level", value: "Junior Level"},
     {key: "Mid Level", value: "Mid Level"},
     {key: "Senior Level", value: "Senior Level"},
     {key: "Lead Level", value: "Lead Level"}
]

export const JobType: OptionItem[] = [
     {key: "Remote", value: "Remote"},
     {key: "Hybrid", value: "Hybrid"},
     {key: "Onsite", value: "Onsite"}
]

export const Status: OptionItem[] = [
     {key: "true", value: "true"},
     {key: "false", value: "false"}
]


export const QualificationType: OptionItem[] =[
    {key: "DOCTORATE", value: "DOCTORATE"},
    {key: "PHD", value: "PHD"},
    {key: "MASTER", value: "MASTER"},
    {key: "DEGREE", value: "DEGREE"},
    {key: "DIPLOMA", value: "DIPLOMA"},
    {key: "POSTGRADUATE_DIPLOMA", value: "POSTGRADUATE DIPLOMA"},
    {key: "HIGH_SCHOOL", value: "HIGH SCHOOL"},
    {key: "FOUNDATION_PROGRAM", value: "FOUNDATION PROGRAM"},
    {key: "COURSE", value: "COURSE"},
    {key: "CERTIFICATE", value: "CERTIFICATE"},
    {key: "BOOTCAMP", value: "BOOTCAMP"},
    {key: "PROFESSIONAL_TRAINING", value: "PROFESSIONAL TRAINING"},
    {key: "VOCATIONAL", value: "VOCATIONAL"},
    {key: "TECHNICAL_CERTIFICATION", value: "TECHNICAL CERTIFICATION"}]

export const SkillType: OptionItem[] = [
    {key: "SoftSkill", value: "Soft Skill"},
    {key: "HardSkill", value: "Hard Skill"}]

export const LanguageLevel : OptionItem[] = [
     {key: "Beginner", value: "Beginner"},
     {key: "Elementary", value: "Elementary"},
     {key: "PreIntermediate", value: "Pre Intermediate"},
     {key: "Intermediate", value: "Intermediate"},
     {key: "UpperIntermediate", value: "Upper Intermediate"},
     {key: "Advanced", value: "Advanced"},
     {key: "Native", value: "Native"}
]


//Company
export const IndustryType: OptionItem[] = [
  // Corporate, Finance & Business Services
  { key: "Staffing & Recruitment Agency", value: "Staffing & Recruitment Agency" },
  { key: "Finance, Banking & Fintech", value: "Finance, Banking & Fintech" },
  { key: "Insurance Services", value: "Insurance Services" },
  { key: "Human Resources & Recruiting", value: "Human Resources & Recruiting" },
  { key: "Marketing, Advertising & PR", value: "Marketing, Advertising & PR" },
  { key: "Management Consulting", value: "Management Consulting" },
  { key: "Legal Services", value: "Legal Services" },

  // Tech, Media & Telecom
  { key: "Information Technology", value: "Information Technology" },
  { key: "Software Development & AI", value: "Software Development & AI" },
  { key: "Telecommunications", value: "Telecommunications" },
  { key: "Cybersecurity & Network Security", value: "Cybersecurity & Network Security" },
  { key: "Entertainment, Media & Gaming", value: "Entertainment, Media & Gaming" },

  // Healthcare, Science & Pharmacy
  { key: "Healthcare, Hospitals & Medical", value: "Healthcare, Hospitals & Medical" },
  { key: "Pharmaceuticals & Biotech", value: "Pharmaceuticals & Biotech" },
  { key: "Medical Devices & Equipment", value: "Medical Devices & Equipment" },

  // Commerce, Goods & Hospitality
  { key: "Retail & E-Commerce", value: "Retail & E-Commerce" },
  { key: "Wholesale & Distribution", value: "Wholesale & Distribution" },
  { key: "Food & Beverage Services", value: "Food & Beverage Services" },
  { key: "Hospitality, Travel & Tourism", value: "Hospitality, Travel & Tourism" },

  // Infrastructure, Industry & Logistics
  { key: "Construction & Real Estate", value: "Construction & Real Estate" },
  { key: "Logistics, Supply Chain & Freight", value: "Logistics, Supply Chain & Freight" },
  { key: "Manufacturing & Production", value: "Manufacturing & Production" },
  { key: "Automotive & Aerospace", value: "Automotive & Aerospace" },
  { key: "Energy, Oil, Gas & Utilities", value: "Energy, Oil, Gas & Utilities" },

  // Education, Public & Non-Profit
  { key: "Education & E-Learning", value: "Education & E-Learning" },
  { key: "Non-Profit & NGO", value: "Non-Profit & NGO" },
  { key: "Government & Public Sector", value: "Government & Public Sector" },
  { key: "Agriculture & Farming", value: "Agriculture & Farming" }
];

export const ApplicationStatusType: OptionItem[] = [
   {key: "APPLIED", value: "APPLIED"},
   {key: "REVIEWING", value: "REVIEWING"},
   {key: "SHORTLISTED", value: "SHORTLISTED"},
   {key: "INTERVIEW", value: "INTERVIEW"},
   {key: "OFFERED", value: "OFFERED"},
   {key: "HIRED", value: "HIRED"},
   {key: "REJECTED", value: "REJECTED"}
];


export const months: OptionItem[] = [
     ...Array.from({ length: 12 }, (_, i) => ({
        key: String(i + 1),
        value: new Date(0, i).toLocaleString("default", {
            month: "long"
        })
    }))
]
