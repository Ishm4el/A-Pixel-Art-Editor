import { useState } from "react";
import Picture from "./Picture";
import { draw, fill, pick, rectangle } from "./tools";
import ToolSelect from "./ToolSelect";
import ColorSelect from "./ColorSelect";
import State, { type tool } from "./State";
import PixelEditor from "./PixelEditor.tsx";

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
          controls: [ToolSelect, ColorSelect],
          dispatch: (action: {
            tool?: tool;
            color?: string;21
            picture?: Picture;
          }) => {
            const update = (updatedState: State) => {
              setState(updatedState);
            };

            update(
              new State({
                color: action.color ?? state.color,
                tool: action.tool ?? state.tool,
                picture: action.picture ?? state.picture,
              })
            );
          },
        }}
      />
    </>
  );
}
