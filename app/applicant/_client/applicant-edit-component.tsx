'use client'

import { ApplicantForm, ApplicantSchema } from "@/lib/type/schema/applicant/applicant.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import * as applicant from "@/lib/actions/applicant/applicant.action" 


export default function ApplicantEditComponent({id} : {id: string}) {

    const form = useForm<ApplicantForm>({
      resolver: zodResolver(ApplicantSchema),
            defaultValues: {
            applicantName: "",
            gender: "",
            highestEducationalAttainment: "",
            skills: [{skill: ""}],
            professionalSummary: "",
            contactDetail: "",
            address: "",
            experiences: [{
                companyName: "",
                position: "",
                year: ""
            }]
        }
    })


    const skillsFieldArray = useFieldArray({
        control: form.control,
        name: 'skills'
    })

    const experiencesFieldArray = useFieldArray({
            control: form.control,
            name: 'experiences'
    })
    

    const appendSkill = () => {
            skillsFieldArray.append({skill: ""})
    }

    const removeSkill = (index: number) => {
            skillsFieldArray.remove(index)

            const skills = form.watch('skills')
            
            if(skills.length == 0) {
                appendSkill()
            }
    }

    const appendExperiences = () => {
        experiencesFieldArray.append({companyName: "", position: "", year: ""})
    }
    
    const removeExperiences = (index: number) => {
            experiencesFieldArray.remove(index)

            const experiences = form.watch('experiences')
            
            if(experiences.length == 0) {
                appendExperiences()
            }
    }

    useEffect(() => {
         async function load() {
             const result = await applicant.findByName()
             if(result) {
                 form.reset({
                     applicantName: result.name,
                     gender: result.gender,
                     highestEducationalAttainment: result.highestEducationalAttainment,
                     skills: result.skills.map(skill => ({skill: skill})),
                     professionalSummary: result.professionalSummary,
                     contactDetail: result.contactDetail,
                     address: result.address,
                     experiences: result.experience
                 })
             }
         }

         load()

    }, [id, form])
    


    return (
        <h1>Edit Applicant {id}</h1>
     )
}
