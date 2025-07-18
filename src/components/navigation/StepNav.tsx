import { NavLink } from "react-router-dom";
import type { RecipeStepNavItem } from "../../constants/navigation";

export interface StepNavProps {
  steps: RecipeStepNavItem[];
}

// Utility function to join class names (simple implementation)
function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function StepNav({ steps }: StepNavProps) {
  return (
    <nav aria-label="Design Recipe Steps">
      <h2 className="text-sm font-medium text-neutral-600 mb-3">
        Design Recipe
      </h2>
      <ul role="list" className="space-y-2">
        {steps.map((step) => (
          <li key={step.id}>
            <NavLink
              to={step.route}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  "block px-3 py-2 rounded-md transition text-sm",
                  isActive
                    ? "bg-neutral-600 text-white font-medium"
                    : "text-neutral-800 hover:bg-neutral-200"
                )
              }
              end
            >
              {step.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
