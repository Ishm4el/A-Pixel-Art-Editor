import State, { isValidTool } from "../../classes/State";
import { type config } from "../PixelEditor";

// interface config {
//   tools: {
//     draw: typeof draw;
//     fill: typeof fill;
//     pick: typeof pick;
//     rectangle: typeof rectangle;
//   };
//   dispatch: (action: { [key: string]: string }) => void;
// }

interface ToolSelect {
  state: State;
  config: config;
}

export default function ToolSelect({ state, config }: ToolSelect) {
  return (
    <label htmlFor="toolSelect">
      <select
        name="toolSelect"
        id="toolSelect"
        onChange={(ev) => {
          const selectedTool = ev.currentTarget.value;
          if (isValidTool(selectedTool)) {
            config.dispatch({ tool: selectedTool });
            ev.currentTarget.nodeValue = state.tool;
          } else {
            throw new Error("Tool does not match any valid tool");
          }
        }}
      >
        {Object.keys(config.tools).map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </label>
  );
}
