import PictureCanvas from "./PictureCanvas.tsx";
import type Picture from "./Picture";
import { fill, pick, rectangle, draw } from "./tools";
import ToolSelect from "./ToolSelect.tsx";
import ColorSelect from "./ColorSelect.tsx";
import type State from "./State";
import type { tool } from "./State";
import SaveButton from "./SaveButton.tsx";
import LoadButton from "./LoadButton.tsx";
import UndoButton from "./UndoButton.tsx";

type pos = {
  x: number;
  y: number;
};

// type controls = [typeof ToolSelect, typeof ColorSelect];

export interface Dispatch {
  tool?: tool;
  color?: string;
  picture?: Picture;
  undo?: boolean;
}

export type DispatchFunction = (action: Dispatch) => void;

export interface config {
  tools: {
    draw: typeof draw;
    fill: typeof fill;
    pick: typeof pick;
    rectangle: typeof rectangle;
  };
  // controls: controls;
  dispatch: DispatchFunction;
}

export type masterState = [State, React.Dispatch<React.SetStateAction<State>>];

interface PixelEditor {
  masterState: masterState;
  config: config;
}

export default function PixelEditor({ masterState, config }: PixelEditor) {
  const posFunction = (pos: pos) => {
    const tool = config.tools[masterState[0].tool];
    const onMove = tool(pos, masterState, config.dispatch);
    if (onMove) return (pos: pos) => onMove(pos, masterState);
  };

  return (
    <div>
      <PictureCanvas
        picture={masterState[0].picture}
        pointerDown={posFunction}
      />
      <br />
      <ToolSelect config={config} state={masterState[0]} />{" "}
      <ColorSelect config={config} state={masterState[0]} />{" "}
      <SaveButton state={masterState[0]} />
      <LoadButton dispatch={config.dispatch} />
      <UndoButton dispatch={config.dispatch} state={masterState[0]} />
    </div>
  );
}
