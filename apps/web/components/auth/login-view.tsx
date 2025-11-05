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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const LoginView = () => {
  const [showPassword, setShowPassword] = useState("password");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col">
        <div className="mb-8 flex flex-col gap-1.5">
          <h2 className="text-4xl tracking-tight font-medium text-neutral-700">
            Welcome Back
          </h2>
          <p className="text-sm text-neutral-400 ml-0.5">
            Login to your account to continue
          </p>
        </div>
        <Button
          className="w-full h-12 font-medium text-neutral-500 hover:text-neutral-700 transition-colors duration-300"
          variant="outline"
        >
          <Image
            src="/google-icon.svg"
            alt="Google Icon"
            width={20}
            height={20}
            className="mr-1"
          />
          Continue with Google
        </Button>
        <div className="flex items-center w-full gap-2.5 my-5">
          <Separator className="flex-1" />
          <span className="text-neutral-500 text-sm">Or</span>
          <Separator className="flex-1" />
        </div>
        <form
          id="form-rhf-demo"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <div className="border px-2.5 py-2 rounded-lg flex gap-2 items-center bg-neutral-100">
                  <span className="w-fit p-1.5 bg-white rounded-md">
                    <MailIcon />
                  </span>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="johndoe@gmail.com"
                    autoComplete="off"
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
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <div className="border px-2.5 py-2 rounded-lg flex gap-2 items-center bg-neutral-100">
                  <span className="w-fit p-1.5 bg-white rounded-md">
                    <LockPasswordIcon />
                  </span>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="off"
                    type={showPassword}
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
            className="w-full h-12 mt-2 bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-inner transition-colors duration-300"
          >
            Login
          </Button>
        </form>
        <Link
          href="/signup"
          className="mt-4 inline-block text-sm text-neutral-400 self-center "
        >
          Don't have an account?{" "}
          <span className="font-medium text-emerald-700 hover:underline hover:text-emerald-900 transition-colors duration-300">
            Signup
          </span>
        </Link>
      </div>
    </div>
  );
};
