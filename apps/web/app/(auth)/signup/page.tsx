import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Cenra",
  description: "Create a new Cenra account to build intelligent chat widgets and elevate your customer support experience.",
};

import { SignupView } from '@/views/auth/signup-view'

const Signup = () => {
  return (
    <SignupView />
  )
}

export default Signup
