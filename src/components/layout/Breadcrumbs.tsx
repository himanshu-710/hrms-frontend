import { Link, useLocation } from "react-router-dom";

function formatSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Breadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-slate-500">
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/app" className="hover:text-slate-900">
          Home
        </Link>

        {pathnames.slice(1).map((segment, index) => {
          const to = `/${pathnames.slice(0, index + 2).join("/")}`;
          const isLast = index === pathnames.slice(1).length - 1;

          return (
            <div key={to} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="font-medium text-slate-900">
                  {formatSegment(segment)}
                </span>
              ) : (
                <Link to={to} className="hover:text-slate-900">
                  {formatSegment(segment)}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}