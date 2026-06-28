import { Minus, Plus } from "lucide-react";
import { Field, FieldLabel } from "../../../ui/field";
import { Input } from "../../../ui/input";
import type { LinksFieldProps } from "@/interfaces/ProfileInterfaces/profileEditInterfaces";

export default function LinksField({
  register,
  errors,
  linkFields,
  appendLink,
  removeLink,
}: LinksFieldProps) {
  return (
    <Field>
      <div className="flex justify-between items-center">
        <FieldLabel
          htmlFor="links"
          className="block text-sm font-medium mb-1"
        >
          Links
        </FieldLabel>
        <Plus
          size={30}
          className="text-primary p-1 rounded-md hover:bg-primary/20 cursor-pointer"
          onClick={() => appendLink({ name: "", url: "" })}
        />
      </div>
      <div className="flex flex-col gap-3">
        {linkFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No links added yet.</p>
        ) : (
          linkFields.map((field, index) => (
            <div className="flex items-center gap-3" key={field.id}>
              <Minus
                size={30}
                className="text-red-500 p-1 rounded-md hover:bg-red-100 cursor-pointer"
                onClick={() => removeLink(index)}
              />
              <div className="flex gap-3 flex-1 flex-col">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      className="w-full border rounded-md p-2"
                      placeholder="Link Name"
                      {...register(`links.${index}.name`)}
                    />
                    {errors.links?.[index]?.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.links[index].name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      className="w-full border rounded-md p-2"
                      placeholder="https://..."
                      {...register(`links.${index}.url`)}
                    />
                    {errors.links?.[index]?.url && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.links[index].url.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Field>
  );
}