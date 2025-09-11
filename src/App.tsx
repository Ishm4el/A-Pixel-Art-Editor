import { useState } from "react";
import Picture from "./Picture";
import PictureEditor from "./PictureEditor";
import { draw, fill, pick, rectangle } from "./tools";
import ToolSelect from "./ToolSelect";
import ColorSelect from "./ColorSelect";
import State, { type tool } from "./State";

export default function App() {
  const [state, setState] = useState(
    new State({
      tool: "draw",
      color: "#000000",
      picture: Picture.empty(60, 30, "#f0f0f0"),
    })
  );

  const [app] = useState(
    new PictureEditor(state, {
      tools: { draw, fill, rectangle, pick },
      controls: [ToolSelect, ColorSelect],
      dispatch: (action: {
        tool?: tool;
        color?: string;
        picture?: Picture;
      }) => {
        const update = (updatedState: State) => {
          setState(updatedState);
          app.syncState(updatedState);
        };

        update(
          new State({
            color: action.color ?? state.color,
            tool: action.tool ?? state.tool,
            picture: action.picture ?? state.picture,
          })
        );
      },
    })
  );
  return <>{app}</>;
}
