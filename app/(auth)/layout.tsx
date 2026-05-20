import { Metadata } from "next"

export const metadata: Metadata = { 
  title: "Job Portal | Auth Page",
  description: "Sign In and Sign Up Page for All users"
}


export default function AuthLayout({children} : {children: React.ReactNode}) {
    return (
        <div className="flex h-[100vh] w-full">
          <div className="w-2/3 bg-cover bg-center flex justify-center items-center px-5"   style={{backgroundImage: `url(/images/signin.jpg)`} }>
            <div className="flex flex-col gap-4 w-3/5">
                <h1 className="text-4xl font-semibold text-white text-center">Welcome to Job Portal Website</h1>
                <p className="text-white text-1xl text-center">If you still get clipping issues with the sticky navbar, you can use a portal so the dropdown renders outside of the navbar container:and ensures proper rendering.</p>
            </div>
          </div>

          {children}
        </div>
    )
}