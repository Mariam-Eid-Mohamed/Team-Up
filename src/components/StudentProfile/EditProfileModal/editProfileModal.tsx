/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Field } from "../../ui/field";
import { Pencil } from "lucide-react";
import {
  EditProfileSchema,
  type EditProfileInputs,
} from "@/utilis/Validations/Validations";
import placeholder from "@/assets/images/profile-placeholder.png";
import { useProfileStore } from "@/store/ProfileStore/userProfileStore";
import PersonalInfoFields from "./Fields/PersonalInfoField";
import AcademicInfoFields from "./Fields/AcademicInfoField";
import SkillsField from "./Fields/SkillsField";
import LinksField from "./Fields/LinksField";
import CvField from "./Fields/CvField";

export default function EditProfileModal({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  const { profile, editProfile, isSaving, saveError } = useProfileStore();

  if (!profile) return null;

  const profilePictureInputRef = useRef<HTMLInputElement | null>(null);
  const pictureFileRef = useRef<File | null>(null);
  const cvStateRef = useRef<{ file: File | null; cleared: boolean }>({
    file: null,
    cleared: false,
  });
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [editSuccess, setEditSuccess] = useState<boolean | null>(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<EditProfileInputs>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      gpa: profile.gpa ?? undefined,
      availability: profile.availability ?? undefined,
      skills: profile.skills ?? [],
      links: profile.links ?? [],
      cv: {
        filename: profile.cv.filename,
      },
      profile_picture: {
        filename: profile.profile_picture.filename,
      },
    },
  });

  // ── Links field array ──────────────────────────────────────────────────────
  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({ control, name: "links" });

  // ── Profile picture preview ────────────────────────────────────────────────
  const [picturePreview, setPicturePreview] = useState<string>(
    profile.profile_picture.storagePath || placeholder,
  );

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    pictureFileRef.current = file;
    setPicturePreview(URL.createObjectURL(file));
    setValue("profile_picture", { filename: file.name });
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);

    if (data.gpa != null && !isNaN(data.gpa)) {
      formData.append("gpa", String(data.gpa));
    }

    if (data.availability) {
      formData.append("availability", data.availability);
    }

    if (data.skills && data.skills.length > 0) {
      data.skills.forEach((s: string) => formData.append("skills[]", s));
    } else {
      formData.append("skills", "");
    }

    formData.append("links", JSON.stringify(data.links ?? []));

    if (pictureFileRef.current) {
      formData.append("profile_picture", pictureFileRef.current);
    }

    if (cvStateRef.current.file) {
      formData.append("cv", cvStateRef.current.file);
    }
    if (cvStateRef.current.cleared && !cvStateRef.current.file) {
      formData.append("cv_cleared", "true");
    }

    try {
      await editProfile(userId, token, formData);
      setEditSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const backendErrors: string[] = err?.response?.data?.errors ?? [
        err?.response?.data?.message ?? "Something went wrong.",
      ];

      backendErrors.forEach((message: string) => {
        const msg = message.toLowerCase();
        if (msg.includes("username")) {
          setError("username", { message });
        } else if (msg.includes("first name")) {
          setError("first_name", { message });
        } else if (msg.includes("last name")) {
          setError("last_name", { message });
        } else if (msg.includes("gpa")) {
          setError("gpa", { message });
        } else if (msg.includes("availability")) {
          setError("availability", { message });
        } else if (msg.includes("skill")) {
          setError("skills", { type: "server", message });
        } else if (msg.includes("url") || msg.includes("link")) {
          setError("root", { message });
        } else {
          setError("root", { message });
        }
      });
    }
  });

  useEffect(() => {
    if (editSuccess) {
      closeRef.current?.click();
    }
  }, [editSuccess]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-center">
          Edit profile
        </DialogTitle>
        <DialogDescription className="sr-only">
          Make changes to your profile information here. Click save when you're
          done.
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-5 overflow-y-auto max-h-[80vh] -mx-4 px-4"
      >
        {/* ── Profile Picture ───────────────────────────────────────────── */}
        <Field>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={profilePictureInputRef}
            onChange={handlePictureChange}
          />
          <div className="flex justify-center items-center w-full h-full relative">
            <div className="w-40 h-40 md:w-[200px] md:h-[200px] rounded-full bg-gray-200 relative">
              <div className="rounded-full w-full h-full overflow-hidden">
                <img
                  src={picturePreview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div
                className="rounded-full bg-[#1F6B6B] hover:bg-[#164e4e] transition-colors w-8 h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer border-2 md:border-4 border-white absolute right-2 bottom-2"
                onClick={() => profilePictureInputRef.current?.click()}
              >
                <Pencil className="text-white" size={18} />
              </div>
            </div>
          </div>
        </Field>

        <PersonalInfoFields register={register} errors={errors} />

        <AcademicInfoFields
          register={register}
          control={control}
          errors={errors}
        />

        <SkillsField setValue={setValue} watch={watch} errors={errors} />

        <LinksField
          register={register}
          errors={errors}
          linkFields={linkFields}
          appendLink={appendLink}
          removeLink={removeLink}
        />

        <CvField
          initialFilename={profile.cv.filename}
          onChange={(state) => {
            cvStateRef.current = { file: state.file, cleared: state.cleared };
            setValue("cv", {
              filename: state.filename,
            });
          }}
        />

        {/* ── Errors ───────────────────────────────────────────────────── */}
        {errors.root && (
          <p className="text-sm text-red-500 text-center -mt-2">
            {errors.root.message}
          </p>
        )}
        {saveError && (
          <p className="text-sm text-red-500 text-center -mt-2">{saveError}</p>
        )}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <DialogFooter className="flex gap-2 justify-center items-center pt-3">
          <DialogClose asChild>
            <button
              ref={closeRef}
              type="button"
              className="flex-1 py-2.5 border border-purple-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-gray-50 active:scale-95"
            >
              Cancel
            </button>
          </DialogClose>

          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 py-2.5 bg-[#2D7A78] cursor-pointer hover:bg-[#23615f] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </DialogFooter>
      </form>
    </>
  );
}
