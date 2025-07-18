import { NavLink } from "react-router-dom";
import { navItems, type NavItem } from "../../constants/navigation";
import { useStatusDoc, useYMap } from "../../hooks/useYjs";

// Utility function to join class names (simple implementation)
function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function TimelineNav() {
  const statusDoc = useStatusDoc();
  const [statusMap, setStatusValue] = useYMap<boolean>(statusDoc, "status");

  const toggleStatus = (navId: string) => {
    const current = statusMap.get(navId) || false;
    setStatusValue(navId, !current);
  };

  const getCategoryHeader = (category: NavItem["category"]) => {
    switch (category) {
      case "project":
        return { name: "Project", color: "text-neutral-600" };
      case "recipe":
        return { name: "Design Recipe", color: "text-neutral-600" };
      case "final":
        return { name: "Finish", color: "text-green-600" };
      default:
        return { name: "Steps", color: "text-neutral-600" };
    }
  };

  // Group items by category
  const groupedItems: Record<NavItem["category"], NavItem[]> = {
    project: [],
    recipe: [],
    final: [],
  };

  navItems.forEach((item) => {
    groupedItems[item.category].push(item);
  });

  return (
    <nav aria-label="Design Recipe Timeline" data-testid="timeline-nav">
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => {
          if (items.length === 0) return null;

          const header = getCategoryHeader(category as NavItem["category"]);

          return (
            <div key={category}>
              <h2 className={cn("text-sm font-medium mb-3", header.color)}>
                {header.name}
              </h2>
              <ul role="list" className="space-y-2">
                {items.map((item) => {
                  const isComplete = statusMap.get(item.id) === true;

                  return (
                    <li key={item.id} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className="flex-shrink-0 w-4 h-4 rounded-full border-2 border-neutral-300 hover:border-neutral-400 transition-colors flex items-center justify-center"
                        aria-label={`Mark ${item.name} as ${
                          isComplete ? "incomplete" : "complete"
                        }`}
                      >
                        {isComplete && (
                          <svg
                            className="w-3 h-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <NavLink
                        to={item.route}
                        className={({ isActive }: { isActive: boolean }) =>
                          cn(
                            "flex-1 block px-3 py-2 rounded-md transition text-sm",
                            isActive
                              ? "bg-neutral-600 text-white font-medium"
                              : "text-neutral-800 hover:bg-neutral-200",
                            isComplete && "opacity-75"
                          )
                        }
                        end
                        data-testid={`nav-${item.id}`}
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
