import State from "./State";
import { type dispatch } from "./PixelEditor";

type masterState = [State, React.Dispatch<React.SetStateAction<State>>];

function draw(pos: pos, masterState: masterState) {
  function drawPixel(
    { x, y }: { x: number; y: number },
    masterState: masterState
  ) {
    const drawn = { x, y, color: masterState[0].color };
    // dispatch({ picture: masterState[0].picture.draw([drawn]) });
    masterState[1](
      (prev) =>
        new State({
          tool: prev.tool,
          color: prev.color,
          picture: prev.picture.draw([drawn]),
        })
    );
  }
  drawPixel(pos, masterState);
  return drawPixel;
}

function rectangle(start: pos, masterState: masterState, dispatch: dispatch) {
  function drawRectangle(pos: pos) {
    const xStart = Math.min(start.x, pos.x);
    const yStart = Math.min(start.y, pos.y);
    const xEnd = Math.max(start.x, pos.x);
    const yEnd = Math.max(start.y, pos.y);
    const drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: masterState[0].color });
      }
    }
    // console.log(state.picture);
    dispatch({ picture: masterState[0].picture.draw(drawn) });
  }
  drawRectangle(start);
  return drawRectangle;
}

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

function fill(
  { x, y }: { x: number; y: number },
  masterState: masterState,
  dispatch: dispatch
) {
  const targetColor = masterState[0].picture.pixel(x, y);
  const drawn = [{ x, y, color: masterState[0].color }];
  const visited = new Set();
  for (let done = 0; done < drawn.length; done++) {
    for (const { dx, dy } of around) {
      const x = drawn[done].x + dx,
        y = drawn[done].y + dy;
      if (
        x >= 0 &&
        x < masterState[0].picture.width &&
        y >= 0 &&
        y < masterState[0].picture.height &&
        !visited.has(x + "," + y) &&
        masterState[0].picture.pixel(x, y) == targetColor
      )
        drawn.push({ x, y, color: masterState[0].color });
      visited.add(x + "," + y);
    }
  }
  dispatch({ picture: masterState[0].picture.draw(drawn) });
}

function pick(pos: pos, masterState: masterState, dispatch: dispatch) {
  dispatch({ color: masterState[0].picture.pixel(pos.x, pos.y) });
}

export { draw, rectangle, fill, pick };
