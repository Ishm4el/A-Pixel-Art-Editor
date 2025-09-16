import { useEffect, useRef } from "react";
import type { DispatchFunction } from "./PixelEditor";
import type State from "./State";

interface UndoButton {
  state: State;
  dispatch: DispatchFunction;
}

export default function UndoButton({ state, dispatch }: UndoButton) {
  const undoButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (undoButtonRef.current) {
      console.log("in current");
      console.log(state.done);

      undoButtonRef.current.disabled = state.done.length === 0;
    }
  }, [state]);
  return (
    <button onClick={() => dispatch({ undo: true })} ref={undoButtonRef}>
      ⮪ Undo
    </button>
  );
}
