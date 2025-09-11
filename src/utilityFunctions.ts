import { SCALE } from "./settings";

function pointerPosition(
  pos: globalThis.MouseEvent | Touch,
  domNode: React.ReactElement<
    HTMLCanvasElement,
    string | React.JSXElementConstructor<HTMLCanvasElement>
  >
) {
  const rect = domNode.props.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / SCALE),
    y: Math.floor((pos.clientY - rect.top) / SCALE),
  };
}

export { pointerPosition };
