import { Input } from "../../ui/input";
import { Field, FieldLabel } from "../../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { EditProfileInputs } from "@/utilis/Validations/Validations";
import { availability } from "@/data/availability";

interface AcademicInfoFieldsProps {
  register: ReturnType<import("react-hook-form").UseFormRegister<EditProfileInputs>>;
  control: Control<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
}

export default function AcademicInfoFields({
  register,
  control,
  errors,
}: AcademicInfoFieldsProps) {
  return (
    <div className="flex gap-3">
      {/* ── GPA ───────────────────────────────────────────────────────── */}
      <Field>
        <FieldLabel
          htmlFor="gpa"
          className="block text-sm font-medium mb-1"
        >
          GPA
        </FieldLabel>
        <Input
          type="number"
          step="0.01"
          id="gpa"
          className="w-full border rounded-md p-2"
          placeholder="Eg. 3.5"
          {...register("gpa")}
        />
        {errors.gpa && (
          <p className="text-xs text-red-500 mt-1">{errors.gpa.message}</p>
        )}
      </Field>

      {/* ── Availability ──────────────────────────────────────────────── */}
      <Field>
        <FieldLabel
          htmlFor="availability"
          className="block text-sm font-medium mb-1"
        >
          Availability
        </FieldLabel>
        <Controller
          control={control}
          name="availability"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(val) => field.onChange(val)}
            >
              <SelectTrigger
                id="form-rhf-select-availability"
                className="w-full border rounded-md p-2"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {availability.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.availability && (
          <p className="text-xs text-red-500 mt-1">
            {errors.availability.message}
          </p>
        )}
      </Field>
    </div>
  );
}