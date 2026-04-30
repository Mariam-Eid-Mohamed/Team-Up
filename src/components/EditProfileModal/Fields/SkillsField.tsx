import { useEffect, useRef, useState } from "react";
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
import { formatSkill } from "@/utilis/formatSkill";

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
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [inputValue, setInputValue] = useState("");
  const selectedSkills = watch("skills") ?? [];

  // The value to add: prefer the selected dropdown item, fall back to raw typed input
  const pendingValue = selectedSkill?.value ?? formatSkill(inputValue.trim());
  const pendingLabel = selectedSkill?.label ?? formatSkill(inputValue.trim());
  const canAdd =
    pendingValue.length > 0 && !selectedSkills.includes(pendingValue);

  const addSkill = (value: string) => {
    if (!selectedSkills.includes(value)) {
      setValue("skills", [...selectedSkills, value], { shouldValidate: true });
    }
  };

  const handleAdd = () => {
    if (!canAdd) return;
    addSkill(pendingValue);
    setSelectedSkill(null);
    setInputValue("");
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
          <ComboboxInput
            placeholder="Type or select a skill"
            className="w-full focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px]"
            // Track what the user is typing
            onChange={(e) => {
              setInputValue(e.target.value);
              // If user edits the input, clear any previously selected dropdown item
              setSelectedSkill(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            value={inputValue}
          />
          <ComboboxContent
            onWheel={(e) => e.stopPropagation()}
            className="pointer-events-auto"
          >
            <ComboboxEmpty>No skill found. Press + to add anyway.</ComboboxEmpty>
            <ComboboxList>
              {(skill) => (
                <ComboboxItem
                  key={skill.value}
                  value={skill}
                  onClick={() => {
                    setSelectedSkill(skill);
                    setInputValue(skill.label);
                  }}
                >
                  {skill.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Plus
          size={30}
          className={`p-1 rounded-md transition-colors ${
            canAdd
              ? "text-primary hover:bg-primary/20 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleAdd}
        />
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {selectedSkills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills added yet.</p>
        ) : (
          selectedSkills.map((skillValue) => {
            // Show the pretty label if it's a known skill, otherwise show the raw value
            const label =
              skills.find((s) => s.value === skillValue)?.label ?? formatSkill(skillValue);
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