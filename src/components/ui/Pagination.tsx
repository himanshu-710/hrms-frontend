import { Button } from "./Button";

export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex gap-2">
      <Button onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Prev
      </Button>
      <span>
        {page} / {total}
      </span>
      <Button onClick={() => onChange(page + 1)} disabled={page >= total}>
        Next
      </Button>
    </div>
  );
}