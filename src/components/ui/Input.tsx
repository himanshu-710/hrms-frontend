interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: Props) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input className="border p-2 w-full" {...props} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}