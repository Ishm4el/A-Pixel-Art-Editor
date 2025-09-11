import { useState } from "react";
import Picture from "./Picture";
import { draw, fill, pick, rectangle } from "./tools";
import State, { type tool } from "./State";
import PixelEditor from "./PixelEditor";

export default function App() {
  const [state, setState] = useState(
    new State({
      tool: "draw",
      color: "#000000",
      picture: Picture.empty(60, 30, "#f0f0f0"),
    })
  );

  return (
    <>
      <PixelEditor
        state={state}
        config={{
          tools: { draw, fill, rectangle, pick },
          dispatch: (action: {
            tool?: tool;
            color?: string;
            picture?: Picture;
          }) => {
            setState((prev) => {
              return new State({
                color: action.color ?? prev.color,
                tool: action.tool ?? prev.tool,
                picture: action.picture ?? prev.picture,
              });
            });
          },
        }}
      />
    </>
  );
}
