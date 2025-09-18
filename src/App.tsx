import { useState } from "react";
import Picture from "./classes/Picture";
import { fill, pick, rectangle, draw, line, circle } from "./utility/tools";
import State from "./classes/State";
import PixelEditor, { type Dispatch } from "./components/PixelEditor";
import "./App.css";

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
    <main>
      <h1>Pixel Editor</h1>
      <PixelEditor
        masterState={masterState}
        config={{
          tools: { draw, fill, rectangle, pick, line, circle },
          dispatch: dispatchHandler,
        }}
      />
    </main>
  );
}
