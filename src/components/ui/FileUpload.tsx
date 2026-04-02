export function FileUpload({
  onChange,
}: {
  onChange: (file: File) => void;
}) {
  return (
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onChange(file);
      }}
    />
  );
}