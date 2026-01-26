'use client'

import FormsInput from "@/components/fields/form-input"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { signInAction } from "@/lib/actions/auth.action"
import { SignInForm, SignInSchema } from "@/lib/type/schema/auth.schema"
import { safeCall } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form"

export default function SignInFormComponent() {
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
             email: "",
             password: ""
        }
    })

    async function save(form: SignInForm) { //test by removing async
         safeCall(async () => await signInAction(form))
    }

    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(save)}>
                <FormsInput control={form.control} type="email" path="email" label="Email" placeHolder="Enter your email"  className="mb-4" />
                <FormsInput control={form.control} type="password" path="password" label="Password" placeHolder="Enter your password"  className="mb-4" />

                <div className="space-x-3">
                    <Button type="submit">
                        <LogIn/>Sign In
                    </Button>
                    <Button variant='outline' asChild>
                        <Link href={'/signup'}>
                            <UserPlus/> Sign Up
                        </Link>
                    </Button>
                </div>
            </form>
        </Form>
     )
}