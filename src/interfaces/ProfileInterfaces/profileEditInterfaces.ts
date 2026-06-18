import type { EditProfileInputs } from "@/utilis/Validations/Validations";
import type {
  UseFormRegister,
  FieldErrors,
  Control,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  FieldArrayWithId,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";

export interface AcademicInfoFieldsProps {
  register: ReturnType<import("react-hook-form").UseFormRegister<EditProfileInputs>>;
  control: Control<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
}

export interface CvState {
  file: File | null;       
  filename: string | null; 
  cleared: boolean;       
}

export interface CvFieldProps {
  initialFilename?: string | null;
  onChange: (state: CvState) => void;
}

export interface LinksFieldProps {
  register: UseFormRegister<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
  linkFields: FieldArrayWithId<EditProfileInputs, "links", "id">[];
  appendLink: UseFieldArrayAppend<EditProfileInputs, "links">;
  removeLink: UseFieldArrayRemove;
}

export interface PersonalInfoFieldsProps {
  register: UseFormRegister<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
}

export interface SkillsFieldProps {
  setValue: UseFormSetValue<EditProfileInputs>;
  watch: UseFormWatch<EditProfileInputs>;
  errors: FieldErrors<EditProfileInputs>;
}

