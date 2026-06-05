import z from "zod"

export const SignUpSchema = z.object({
     name: z.string().nonempty("Please enter your name."),
     email: z.string().nonempty("Please enter your email."),
     password: z.string().nonempty("Please enter your password."),
     role: z.string().nonempty("Please select role.")
})

export type SignUpForm = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
     email: z.string().nonempty("Please enter your email."),
     password: z.string().nonempty("Please enter your password.")
})

export type SignInForm = z.infer<typeof SignInSchema>

type Role = 'Admin' | 'Applicant' | 'CompanyAccount'

export type LoginUser = {
      name: string
      email: string
      role: Role
}

export type AuthResult = LoginUser &  {
     accessToken: string
     refreshToken: string
}