import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import type { StateFrom } from "xstate";
import { appMachine, type AppEvent } from "../state/appMachine";

export function useRouteSync(
  state: StateFrom<typeof appMachine>,
  send: (event: AppEvent) => void
) {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;

    if (pathname === "/finalise") {
      if (!state.matches("finalising")) {
        send({ type: "FINALISE" });
      }
    } else if (state.matches("finalising") && pathname !== "/finalise") {
      // If we're in finalising state but not on finalise route, go back to ready
      send({ type: "BACK_TO_RECIPE" });
    }
    // Removed the logic that automatically closes files when on recipe routes
    // This allows users to view code files while working on recipe steps
  }, [location, location.pathname, state, send]);
}
