import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Cenra",
  description: "Sign in to your Cenra account to access your AI customer support dashboard and workspace.",
};

import { LoginView } from '@/views/auth/login-view'

const Login = () => {
  return (
    <LoginView />
  )
}

export default Login
