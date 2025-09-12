import { useState } from "react";
import Picture from "./Picture";
import { fill, pick, rectangle, draw } from "./tools";
import State, { type tool } from "./State";
import PixelEditor from "./PixelEditor";

export default function App() {
  const masterState = useState(
    new State({
      tool: "draw",
      color: "#000000",
      picture: Picture.empty(60, 30, "#f0f0f0"),
    })
  );

  return (
    <PixelEditor
      masterState={masterState}
      config={{
        tools: { draw, fill, rectangle, pick },
        dispatch: (action: {
          tool?: tool;
          color?: string;
          picture?: Picture;
        }) => {
          masterState[1]((prev) => {
            return new State({
              color: action.color ?? prev.color,
              tool: action.tool ?? prev.tool,
              picture: action.picture ?? prev.picture,
            });
          });
        },
      }}
    />
  );
}
