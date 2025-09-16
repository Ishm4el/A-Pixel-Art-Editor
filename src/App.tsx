import { useState } from "react";
import Picture from "./Picture";
import { fill, pick, rectangle, draw } from "./tools";
import State from "./State";
import PixelEditor, { type Dispatch } from "./PixelEditor";

export default function App() {
  const masterState = useState(
    new State({
      tool: "draw",
      color: "#000000",
      picture: Picture.empty(60, 30, "#f0f0f0"),
    })
  );

  const dispatchHandler = (action: Dispatch) => {
    masterState[1]((prev) => {
      console.log(prev.doneAt < Date.now() - 1000);

      if (action.undo === true) {
        if (masterState[0].done.length === 0) return prev;
        return new State({
          picture: prev.done[0],
          done: prev.done.slice(1),
          doneAt: 0,
          color: prev.color,
          tool: prev.tool,
        });
      } else if (action.picture && prev.doneAt < Date.now() - 1000) {
        console.log("in action.picture");

        return new State({
          ...prev,
          color: action.color ?? prev.color,
          tool: action.tool ?? prev.tool,
          picture: action.picture ?? prev.picture,
          done: [prev.picture, ...prev.done],
          doneAt: Date.now(),
        });
      } else {
        return new State({
          ...prev,
          color: action.color ?? prev.color,
          tool: action.tool ?? prev.tool,
          picture: action.picture ?? prev.picture,
        });
      }
    });
  };

  return (
    <PixelEditor
      masterState={masterState}
      config={{
        tools: { draw, fill, rectangle, pick },
        dispatch: dispatchHandler,
      }}
    />
  );
}
