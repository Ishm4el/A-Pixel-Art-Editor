import { createContext, useContext } from "react";
import State from "./classes/State";

export const StateContext = createContext<{
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
} | null>(null);

export function useStateContext() {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error(
      "useStateContext needs to be used within <StateContext.Provider>"
    );
  }
  return stateContext;
}
