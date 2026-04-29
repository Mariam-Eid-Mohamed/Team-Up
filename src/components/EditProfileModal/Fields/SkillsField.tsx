import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Field, FieldLabel } from "../../ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../../ui/combobox";
import { skills } from "@/data/skills";
import type { Skill } from "@/interfaces/ProfileInterfaces/skillInterface";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import type { EditProfileInputs } from "@/utilis/Validations/Validations";
import { useProfileStore } from "@/store/ProfileStore/userProfileStore";

interface SkillsFieldProps {
  setValue: UseFormSetValue<EditProfileInputs>;
  watch: UseFormWatch<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
}

export default function SkillsField({
  setValue,
  watch,
  errors,
}: SkillsFieldProps) {
  const { profile } = useProfileStore();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const selectedSkills = watch("skills") ?? [];

  useEffect(() => {
    console.log("Selected skills:", selectedSkills);
    }, [selectedSkills]);

  const addSkill = (skill: Skill) => {
    if (!selectedSkills.includes(skill.value)) {
      setValue("skills", [...selectedSkills, skill.value], {
        shouldValidate: true,
      });
    }
  };

  const removeSkill = (value: string) => {
    setValue(
      "skills",
      selectedSkills.filter((s) => s !== value),
      { shouldValidate: true },
    );
  };

  return (
    <Field>
      <FieldLabel className="block text-sm font-medium mb-1">Skills</FieldLabel>
      <div className="flex gap-2">
        <Combobox
          items={skills}
          itemToStringValue={(skill: Skill) => skill.label}
        >
          <ComboboxInput placeholder="Select a skill" className="w-full focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px]" />
          <ComboboxContent
            onWheel={(e) => e.stopPropagation()}
            className="pointer-events-auto"
          >
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(skill) => (
                <ComboboxItem
                  key={skill.value}
                  value={skill}
                  onClick={() => setSelectedSkill(skill)}
                >
                  {skill.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Plus
          size={30}
          className={`p-1 rounded-md hover:bg-gray-100 ${selectedSkill && !selectedSkills.includes(selectedSkill.label)
            ? "text-primary hover:bg-primary/20 cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={() => {
            if (selectedSkill && !selectedSkills.includes(selectedSkill.label)) {
              addSkill(selectedSkill);
              setSelectedSkill(null);
            }
          }}
        />
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {selectedSkills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills added yet.</p>
        ) : (
          selectedSkills.map((skillValue) => {
            const label =
              skills.find((s) => s.value === skillValue)?.label ?? skillValue;
            return (
              <div
                key={skillValue}
                className="bg-accent px-2 py-1 rounded-sm text-white text-sm flex items-center gap-1"
              >
                {label}
                <button
                  type="button"
                  onClick={() => removeSkill(skillValue)}
                  className="hover:opacity-70 cursor-pointer"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
      {errors.skills && (
        <p className="text-xs text-red-500 mt-1">{errors.skills.message}</p>
      )}
    </Field>
  );
}
