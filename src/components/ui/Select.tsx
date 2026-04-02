interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  options: Option[];
}

export function Select({ label, options }: Props) {
  return (
    <div>
      {label && <label>{label}</label>}
      <select className="border p-2 w-full">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}