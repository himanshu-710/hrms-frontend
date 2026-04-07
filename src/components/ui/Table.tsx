import type { Key, ReactNode } from "react";

type TableRow = Record<string, ReactNode>;

interface TableProps<T extends TableRow> {
  data: T[];
  getRowKey?: (row: T, index: number) => Key;
}

export function Table<T extends TableRow>({
  data,
  getRowKey,
}: TableProps<T>) {
  return (
    <table className="w-full border">
      <tbody>
        {data.map((row, i) => (
          <tr key={getRowKey?.(row, i) ?? i}>
            {Object.values(row).map((val, j) => (
              <td key={j} className="border p-2">
                {val ?? ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
