import { Input } from "../../ui/input";
import { Field, FieldLabel } from "../../ui/field";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { EditProfileInputs } from "@/utilis/Validations/Validations";

interface PersonalInfoFieldsProps {
  register: UseFormRegister<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
}

export default function PersonalInfoFields({
  register,
  errors,
}: PersonalInfoFieldsProps) {
  return (
    <>
      {/* ── Username ─────────────────────────────────────────────────── */}
      <Field>
        <FieldLabel
          htmlFor="username"
          className="block text-sm font-medium mb-1"
        >
          Username
        </FieldLabel>
        <Input
          id="username"
          className="w-full border rounded-md p-2"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-xs text-red-500 mt-1">
            {errors.username.message}
          </p>
        )}
      </Field>

      {/* ── First Name + Last Name ────────────────────────────────────── */}
      <div className="flex gap-3">
        <Field>
          <FieldLabel
            htmlFor="firstName"
            className="block text-sm font-medium mb-1"
          >
            First Name
          </FieldLabel>
          <Input
            id="firstName"
            className="w-full border rounded-md p-2"
            {...register("first_name")}
          />
          {errors.first_name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.first_name.message}
            </p>
          )}
        </Field>
        <Field>
          <FieldLabel
            htmlFor="lastName"
            className="block text-sm font-medium mb-1"
          >
            Last Name
          </FieldLabel>
          <Input
            id="lastName"
            className="w-full border rounded-md p-2"
            {...register("last_name")}
          />
          {errors.last_name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.last_name.message}
            </p>
          )}
        </Field>
      </div>
    </>
  );
}