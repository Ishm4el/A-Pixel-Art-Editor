import State from "../../classes/State";
import type { config } from "../PixelEditor";

interface ColorSelect {
  state: State;
  config: config;
}

export default function ColorSelect({ state, config }: ColorSelect) {
  return (
    <label>
      <input
        type="color"
        value={state.color}
        onChange={(ev) => {
          if (typeof ev.currentTarget.value === "string")
            config.dispatch({ color: ev.currentTarget.value });
          else throw new Error("theColor is not a string!");
        }}
      ></input>
    </label>
  );
}
