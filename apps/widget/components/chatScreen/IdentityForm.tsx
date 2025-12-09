import { z } from "zod/v4";
import { Field, FieldError } from "@workspace/ui/components/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Controller, useForm } from "react-hook-form";
import { Sparkles } from "lucide-react";

export const IdentitySchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.email("Invalid email address"),
});

export type IdentityFormData = z.infer<typeof IdentitySchema>;

interface IdentityFormProps {
  handleIdentitySubmit: (data: IdentityFormData) => void;
  isIdentifying: boolean;
}

export const IdentityForm = ({
  handleIdentitySubmit,
  isIdentifying,
}: IdentityFormProps) => {
  const form = useForm<z.infer<typeof IdentitySchema>>({
    resolver: zodResolver(IdentitySchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <div className="flex items-end gap-1.5 mb-2">
      <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300">
        <Sparkles size={12} className="text-neutral-600" />
      </div>
      <div className="px-3.5 py-3 bg-white border rounded-xl rounded-bl-none mt-2 max-w-[75%] w-full">
        <p className="text-sm mb-3">
          Before we continue, please share your name &amp; email.
        </p>
        <form
          onSubmit={form.handleSubmit(handleIdentitySubmit)}
            className="flex flex-col gap-3"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="John"
                    autoComplete="off"
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-neutral-300 text-neutral-600 transition-colors duration-300"
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
              <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="johndoe@gmail.com"
                    autoComplete="off"
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-neutral-300 text-neutral-600 transition-colors duration-300"
                  />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type="submit"
            disabled={isIdentifying}
            className="px-3 py-2 rounded-lg bg-emerald-800 text-white disabled:opacity-60 text-sm hover:bg-emerald-900"
          >
            {isIdentifying ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};
