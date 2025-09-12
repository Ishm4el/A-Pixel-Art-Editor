import State from "./State";
import { type config } from "./PixelEditor";

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
          console.log(ev.currentTarget.value);
          console.log(ev.currentTarget.nodeValue);

          config.dispatch({ tool: ev.currentTarget.value });
          ev.currentTarget.nodeValue = state.tool;
        }}
      >
        {Object.keys(config.tools).map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </label>
  );
}
