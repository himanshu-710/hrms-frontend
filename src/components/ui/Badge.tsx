export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
      {children}
    </span>
  );
}