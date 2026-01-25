'use client'

import FormsInput from "@/components/fields/form-input";
import FormSelect from "@/components/fields/form-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SignUpForm, SignUpSchema } from "@/lib/type/shema/auth.schema";
import { RoleOptions } from "@/lib/type/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";


export default function SignUpFormComponent() {
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
          role: undefined 
        }
    })

    
    async function save(form: SignUpForm) {
       
    }


     return (
        <Form {...form}>
            <form action="#" onSubmit={form.handleSubmit(save)}>
                <FormsInput control={form.control} path="name" label="Name"  placeHolder="Enter your name"  className="mb-4" />
                <FormsInput control={form.control} type="email" path="email" label="Email" placeHolder="Enter your email"  className="mb-4" />
                <FormsInput control={form.control} type="password" path="password" label="Password" placeHolder="Enter your password"  className="mb-4" />
                <FormSelect control={form.control} path="role" label="Role" options={RoleOptions} className="mb-4"/>

                <div className="space-x-3">
                    <Button type="submit">
                        <LogIn/>Sign Up
                    </Button>
                    <Button variant='outline' asChild>
                        <Link href={'/signin'}>
                            <UserPlus/> Sign In
                        </Link>
                    </Button>
                </div>
            </form>
        </Form>
     )
}