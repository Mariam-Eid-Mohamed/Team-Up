import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Field, FieldLabel } from "../../../ui/field";
import { Button } from "../../../ui/button";
import type { CvState, CvFieldProps } from "@/interfaces/ProfileInterfaces/profileEditInterfaces";


export default function CvField({ initialFilename, onChange }: CvFieldProps) {
  const cvInputRef = useRef<HTMLInputElement | null>(null);
  const [cvState, setCvState] = useState<CvState>({
    file: null,
    filename: initialFilename ?? null,
    cleared: false,
  });

  useEffect(() => {
    onChange(cvState);
  }, [cvState]);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvState({ file, filename: file.name, cleared: false });
  };

  const handleClear = () => {
    if (cvInputRef.current) cvInputRef.current.value = "";
    setCvState({ file: null, filename: null, cleared: true });
  };

  return (
    <Field>
      <FieldLabel htmlFor="cv" className="block text-sm font-medium mb-1">
        CV
      </FieldLabel>
      <div className="flex items-center border rounded-md overflow-hidden w-full">
        <Button
          type="button"
          onClick={() => cvInputRef.current?.click()}
          className="rounded-none bg-[#2D7A78] hover:bg-[#23615f] transition-colors text-white cursor-pointer"
        >
          Upload file
        </Button>
        <div className={`flex-1 px-3 py-2 text-sm ${!cvState.filename && "text-muted-foreground"} truncate`}>
          {cvState.filename || "No file chosen"}
        </div>

        {cvState.filename && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        <input
          id="cv"
          ref={cvInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleCvChange}
        />
      </div>
    </Field>
  );
}