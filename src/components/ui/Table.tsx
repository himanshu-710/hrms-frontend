export function Table({ data }: { data: any[] }) {
  return (
    <table className="w-full border">
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((val, j) => (
              <td key={j} className="border p-2">
                {String(val)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}