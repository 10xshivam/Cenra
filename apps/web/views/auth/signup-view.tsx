"use client";

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Separator } from "@workspace/ui/components/separator";
import {
  LockPasswordIcon,
  MailIcon,
  ViewIcon,
  ViewOffIcon,
} from "@workspace/ui/components/icons";
import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { toast } from "sonner";
import { signupSchema } from "@/schemas/signupSchema";
import { useGoogleLoginMutation, useSignupUser } from "@/hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";

export const SignupView = () => {
  const signupMutation = useSignupUser();
  const googleLoginMutation = useGoogleLoginMutation();

  const [showPassword, setShowPassword] = useState("password");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));
  };

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const getGoogleCode = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (codeResponse) => {
      googleLoginMutation.mutate(codeResponse.code);
    },
    onError: (error) => {
      toast.error(
        `Google login failed: ${typeof error === "string" ? error : JSON.stringify(error)}`
      );
    },
  });

  return (
    <div className="w-fit h-full flex flex-col items-center justify-center border border-neutral-300 border-dashed p-7 bg-white/40">
      <div className="w-xs md:w-md flex flex-col">
        <div className="mb-8 flex flex-col gap-1.5">
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-neutral-700 font-serif">
            Get Started
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 ml-0.5">
            Create your free account to continue
          </p>
        </div>
        <Button
          className="w-full h-12 font-medium text-neutral-500 hover:text-neutral-700 transition-colors duration-300 rounded-none shadow-none border-neutral-300 hover:bg-white/70 bg-white/60"
          variant="outline"
          onClick={() => getGoogleCode()}
          disabled={googleLoginMutation.isPending}
        >
          {googleLoginMutation.isPending ? (
            "Loading..."
          ) : (
            <>
              <img src="/google-icon.svg" alt="Google Icon" width={20} height={20} className="mr-1" />
              Continue with Google
            </>
          )}
        </Button>
        <div className="flex items-center w-full gap-2.5 my-5">
          <Separator className="flex-1" />
          <span className="text-neutral-500 text-sm">Or</span>
          <Separator className="flex-1" />
        </div>
        <form
          onSubmit={form.handleSubmit((values: z.infer<typeof signupSchema>) =>
            signupMutation.mutate(values)
          )}
          className="flex flex-col gap-5"
        >
          <div className="flex gap-3">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor={field.name} className="text-xs">First Name</FieldLabel>
                  <div className="border border-neutral-300 px-2.5 py-1 flex gap-2 items-center">
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="John"
                      autoComplete="off"
                      className="border-none bg-transparent"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor={field.name} className="text-xs">
                    Last Name
                  </FieldLabel>
                  <div className="border border-neutral-300 px-2.5 py-1 flex gap-2 items-center">
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Doe"
                      autoComplete="off"
                      className="border-none bg-transparent"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name} className="text-xs">
                  Email
                </FieldLabel>
                <div className="border border-neutral-300 px-2.5 py-1 flex gap-2 items-center">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="johndoe@gmail.com"
                    autoComplete="off"
                    className="border-none bg-transparent"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name} className="text-xs">
                  Password
                </FieldLabel>
                <div className="border border-neutral-300 px-2.5 py-1 flex gap-2 items-center">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="off"
                    type={showPassword}
                    className="border-none bg-transparent"
                  />
                  {showPassword === "password" ? (
                    <ViewOffIcon
                      onClick={togglePasswordVisibility}
                      className="cursor-pointer"
                    />
                  ) : (
                    <ViewIcon
                      onClick={togglePasswordVisibility}
                      className="cursor-pointer"
                    />
                  )}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type="submit"
            className="w-full h-12 mt-2 bg-emerald-800 hover:bg-emerald-900 rounded-none transition-colors duration-300"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm text-neutral-400 self-center trcaking-tight "
        >
          Already have an account?{" "}
          <span className="font-medium text-emerald-700 hover:underline hover:text-emerald-900 transition-colors duration-300">
            Login
          </span>
        </Link>
      </div>
    </div>
  );
};
