'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ApplicantForm, ApplicantSchema } from "@/lib/type/schema/applicant/applicant.schema"
import PageTitle from "@/components/widgets/page-title"
import { Form } from "@/components/ui/form"
import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import FormsTextAreaInput from "@/components/fields/form-textarea"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { safeCall } from "@/lib/utils"
import * as Applicant from "@/lib/actions/applicant/applicant.action" 

export default function ApplicantEditPage() {

    const router = useRouter()

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
    
    const searchParam = useSearchParams()
    const id = searchParam.get("id")

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

     async function save(form: ApplicantForm) {
         await safeCall(async () =>  { 
            const result = Applicant.createApplicantAction(form)
            router.replace(`/applicant/${result}`)
        })

     }


    return (
        <section className="space-y-4">
             <PageTitle icon="User" title={id ? 'Applicant Edit' : 'Applicant Create'}/>
             
             <Form {...form}>
                <form  onSubmit={form.handleSubmit(save)} className="grid grid-cols-3 gap-3 space-y-2">
                    
                    <FormsInput control={form.control} path="applicantName" label="Applicant Name" placeHolder="Enter your applicant name"  />
                    <FormSelect control={form.control} path="gender" label="Gender"  options={[{key: "Male", value: "Male"}, {key: "Female", value: "Female"}]} />
                    <FormsTextAreaInput control={form.control} path="highestEducationalAttainment" label="Highest Education Attainment" placeHolder="Enter Highest Education Attainment " className="col-span-2" />
                    <FormsTextAreaInput control={form.control} path="professionalSummary" label="Professional Summary" placeHolder="Please fill your professional summary" className="col-span-2" rowHeight="min-h-[100px]"/>
                    <FormsTextAreaInput control={form.control} path="contactDetail" label="Contact Detail" placeHolder="Enter your contact detail" className="col-span-2" />
                    <FormsTextAreaInput control={form.control} path="address" label="Address" placeHolder="Enter your address" className="col-span-2" rowHeight="min-h-[100px]" />
                    
                        <div className="col-span-2 space-y-2">     
                            <h5 className="text-1xl">Skill</h5>                       
                            {skillsFieldArray.fields.map((field, index) => 
                                <div key={field.id} className="flex items-start gap-2">
                                    <FormsInput control={form.control} path={`skills.${index}.skill`}   className="w-fit" />
                                    <Button type="button" onClick={() => appendSkill()}>
                                        <Plus/>
                                    </Button>
                                    <Button type="button" onClick={() => removeSkill(index)}  className="bg-red-500  hover:text-blue-300" >
                                        <Trash/>
                                    </Button>
                                </div>
                            )}
                        </div>

                    <div className="col-span-2 space-y-2">
                        <h5 className="text-1xl">Experiences</h5>   
                        {experiencesFieldArray.fields.map((fields, index) => 
                        <div key={fields.id} className="flex items-start gap-3">
                            <FormsInput control={form.control} path={`experiences.${index}.companyName`} className="w-3/5" placeHolder="Enter your company name" />
                            <FormsInput control={form.control} path={`experiences.${index}.position`} className="w-3/5"  placeHolder="Enter your position"/>
                            <FormsInput control={form.control} type="number" path={`experiences.${index}.year`} className="w-1/5" placeHolder="year" />
                            <Button type="button" onClick={() => appendExperiences()}> 
                                <Plus/>
                            </Button>
                            <Button type="button" onClick={() => removeExperiences(index)} className="bg-red-500  hover:text-blue-300">
                              <Trash/>
                            </Button>
                        </div>
                        )}
                    </div>
                    
                    <div className="col-span-full" >
                        <Button type="submit" className="w-30">
                            <Plus/> Submit
                        </Button>
                    </div>
                </form>
             </Form>
        </section>
    )
}