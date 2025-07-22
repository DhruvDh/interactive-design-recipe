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
    const inRecipe =
      pathname === "/overview" || matchPath("/step/:id", pathname) !== null;

    if (pathname === "/finalise") {
      if (!state.matches("finalising")) {
        send({ type: "FINALISE" });
      }
    } else if (inRecipe) {
      if (state.matches("finalising")) {
        send({ type: "BACK_TO_RECIPE" });
      }
      if (state.matches("viewingCode")) {
        send({ type: "CLOSE_ALL" });
      }
    }
  }, [location, location.pathname, state, send]);
}
