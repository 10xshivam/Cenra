"use client";

import { useUserStore } from "@/store/useUserStore";
import { useUpdateUser } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/schemas/profileSchema";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Section } from "./section";

export const ProfileTab = () => {
    const { user } = useUserStore();
    const updateMutation = useUpdateUser();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            email: user?.email ?? "",
        },
    });

    // Sync form when store hydrates
    useEffect(() => {
        form.reset({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            email: user?.email ?? "",
        });
    }, [user, form]);

    const onSubmit = (values: ProfileFormValues) => {
        updateMutation.mutate(values, {
            onSuccess: () => {
                toast.success("Profile updated successfully.");
                form.reset(values);
            },
        });
    };

    return (
        <div className="space-y-5">
            <Section
                title="Personal Details"
                description="Your personal information visible to your account."
            >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                            name="firstName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        className="border border-neutral-300 bg-white px-3 shadow-none"
                                        placeholder="John"
                                    />
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
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        className="border border-neutral-300 bg-white px-3 shadow-none"
                                        placeholder="Doe"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="email"
                                        aria-invalid={fieldState.invalid}
                                        className="border border-neutral-300 bg-white px-3 shadow-none"
                                        placeholder="john@example.com"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || updateMutation.isPending}
                            className="h-9 px-4 text-sm font-medium bg-emerald-800 border-2 border-b-4 border-emerald-700 hover:bg-emerald-900 text-white rounded-lg disabled:opacity-50 gap-1.5"
                        >
                            {updateMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Section>
        </div>
    );
};
