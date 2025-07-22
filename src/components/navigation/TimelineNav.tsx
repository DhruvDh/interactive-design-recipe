import { NavLink } from "react-router-dom";
import { navItems } from "../../constants/navigation";
import clsx from "clsx";
import { useStatusDoc, useYMap } from "../../hooks/useYjs";
import { radius } from "../../theme";

type Status = "todo" | "done";

export interface TimelineNavProps {
  disabled?: boolean;
}
export function TimelineNav({ disabled = false }: TimelineNavProps) {
  const statusDoc = useStatusDoc();
  const [statusMap, toggle] = useYMap<Status>(statusDoc, "status");

  /** Renders a single step */
  const Step = ({ id, name, route }: (typeof navItems)[number]) => {
    const status: Status = statusMap.get(id) ?? "todo";
    const isDisabled = disabled && id !== "select";

    return (
      <li className="relative pl-6">
        {/* vertical line */}
        <span className="absolute left-2 top-0 h-full w-px bg-brand-200"></span>

        {/* status icon */}
        <button
          aria-label="toggle complete"
          onClick={() => toggle(id, status === "done" ? "todo" : "done")}
          className={clsx(
            "absolute -left-0.5 top-0 w-4 h-4 flex items-center justify-center",
            radius.pill,
            status === "done"
              ? "bg-green-600 text-white"
              : "bg-white border border-brand-300"
          )}
        >
          {status === "done" && "✓"}
        </button>

        {/* main link */}
        <NavLink
          to={route}
          end
          aria-disabled={isDisabled || undefined}
          tabIndex={isDisabled ? -1 : undefined}
          onClick={isDisabled ? (e) => e.preventDefault() : undefined}
          className={({ isActive }) =>
            clsx(
              "block rounded-md px-3 py-2 text-sm transition",
              isDisabled
                ? "text-neutral-400 cursor-not-allowed"
                : isActive
                ? "bg-brand-700 text-white"
                : "hover:bg-brand-100"
            )
          }
        >
          {name}
        </NavLink>
      </li>
    );
  };

  return (
    <nav data-testid="timeline-nav" className="select-none">
      <ul role="list" className="space-y-1">
        {navItems.map(Step)}
      </ul>
    </nav>
  );
}
