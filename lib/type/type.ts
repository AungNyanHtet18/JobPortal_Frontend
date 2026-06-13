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
     {key: "Intern", value: "Intern Level"},
     {key: "Entry", value: "Entry Level"},
     {key: "Junior", value: "Junior Level"},
     {key: "Senior", value: "Senior Level"},
     {key: "Lead", value: "Lead"}
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
  { key: "STAFFING_RECRUITMENT_AGENCY", value: "Staffing & Recruitment Agency" },
  { key: "FINANCE_BANKING", value: "Finance, Banking & Fintech" },
  { key: "INSURANCE", value: "Insurance Services" },
  { key: "HUMAN_RESOURCES", value: "Human Resources & Recruiting" },
  { key: "MARKETING_ADVERTISING", value: "Marketing, Advertising & PR" },
  { key: "MANAGEMENT_CONSULTING", value: "Management Consulting" },
  { key: "LEGAL_SERVICES", value: "Legal Services" },

  // Tech, Media & Telecom
  { key: "INFORMATION_TECHNOLOGY", value: "Information Technology" },
  { key: "SOFTWARE_DEVELOPMENT", value: "Software Development & AI" },
  { key: "TELECOMMUNICATIONS", value: "Telecommunications" },
  { key: "CYBERSECURITY", value: "Cybersecurity & Network Security" },
  { key: "ENTERTAINMENT_MEDIA", value: "Entertainment, Media & Gaming" },

  // Healthcare, Science & Pharmacy
  { key: "HEALTHCARE_MEDICAL", value: "Healthcare, Hospitals & Medical" },
  { key: "PHARMACEUTICALS", value: "Pharmaceuticals & Biotech" },
  { key: "MEDICAL_DEVICES", value: "Medical Devices & Equipment" },

  // Commerce, Goods & Hospitality
  { key: "RETAIL_ECOMMERCE", value: "Retail & E-Commerce" },
  { key: "WHOLESALE_DISTRIBUTION", value: "Wholesale & Distribution" },
  { key: "FOOD_BEVERAGE", value: "Food & Beverage Services" },
  { key: "HOSPITALITY_TOURISM", value: "Hospitality, Travel & Tourism" },

  // Infrastructure, Industry & Logistics
  { key: "CONSTRUCTION_REAL_ESTATE", value: "Construction & Real Estate" },
  { key: "LOGISTICS_SUPPLY_CHAIN", value: "Logistics, Supply Chain & Freight" },
  { key: "MANUFACTURING_PRODUCTION", value: "Manufacturing & Production" },
  { key: "AUTOMOTIVE", value: "Automotive & Aerospace" },
  { key: "ENERGY_UTILITIES", value: "Energy, Oil, Gas & Utilities" },

  // Education, Public & Non-Profit
  { key: "EDUCATION_ELEARNING", value: "Education & E-Learning" },
  { key: "NON_PROFIT_NGO", value: "Non-Profit & NGO" },
  { key: "GOVERNMENT_PUBLIC_SECTOR", value: "Government & Public Sector" },
  { key: "AGRICULTURE", value: "Agriculture & Farming" }
];