import { useEffect, useRef, useState } from "react";
import { Button, Select } from "@/components/ui";

type DocumentUploadCardProps = {
  selectedCategory?: string;
  onUpload: (
    file: File,
    docCategory: string,
    onProgress: (progress: number) => void
  ) => Promise<void>;
};


export default function DocumentUploadCard({
  selectedCategory,
  onUpload,
}: DocumentUploadCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [docCategory, setDocCategory] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setDocCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const validateFile = (selectedFile: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 5 MB");
      setFile(null);
      return;
    }
    setError("");
    setFile(selectedFile);
  };

    const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!docCategory) {
      setError("Please select document category");
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      setProgress(0);

      await onUpload(file, docCategory, (value) => {
        setProgress(value);
      });

      setProgress(100);
      setFile(null);
      setDocCategory("");
    } catch {
      setError("Upload failed");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Upload Document</h3>
        <p className="text-sm text-slate-600">Max file size: 5 MB</p>
      </div>

      <Select
        label="Document Category"
        value={docCategory}
        onChange={(e) => setDocCategory(e.target.value)}
        options={[
          { label: "Select category", value: "" },
          { label: "AADHAAR", value: "AADHAAR" },
          { label: "PAN", value: "PAN" },
          { label: "PASSPORT", value: "PASSPORT" },
          { label: "RESUME", value: "RESUME" },
          { label: "PHOTO", value: "PHOTO" },
        ]}
      />

      <div
        className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) validateFile(droppedFile);
        }}
      >
        <p className="mb-3 text-sm text-slate-600">
          Drag and drop file here or choose manually
        </p>

        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          Choose File
        </Button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) validateFile(selectedFile);
          }}
        />
      </div>

      {file && (
        <p className="text-sm text-green-600">
          Selected: {file.name}
        </p>
      )}

      {progress > 0 && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="button" onClick={handleUpload} isLoading={isUploading}>
        Upload Document
      </Button>
    </div>
  );
}
