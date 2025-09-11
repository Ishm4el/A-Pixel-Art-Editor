import { SCALE } from "./settings";

function pointerPosition(
  pos:
    | React.MouseEvent<HTMLCanvasElement, MouseEvent>
    | MouseEvent
    | React.Touch,
  domNode: HTMLCanvasElement
) {
  const rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / SCALE),
    y: Math.floor((pos.clientY - rect.top) / SCALE),
  };
}

export { pointerPosition };
