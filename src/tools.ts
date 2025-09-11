import State from "./State";
import { type dispatch } from "./PixelEditor";

function draw(pos: pos, state: State, dispatch: dispatch) {
  function drawPixel({ x, y }: { x: number; y: number }, state: State) {
    const drawn = { x, y, color: state.color };
    dispatch({ picture: state.picture.draw([drawn]) });
  }
  drawPixel(pos, state);
  return drawPixel;
}

function rectangle(start: pos, state: State, dispatch: dispatch) {
  function drawRectangle(pos: pos) {
    const xStart = Math.min(start.x, pos.x);
    const yStart = Math.min(start.y, pos.y);
    const xEnd = Math.max(start.x, pos.x);
    const yEnd = Math.max(start.y, pos.y);
    const drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
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
  state: State,
  dispatch: dispatch
) {
  const targetColor = state.picture.pixel(x, y);
  const drawn = [{ x, y, color: state.color }];
  const visited = new Set();
  for (let done = 0; done < drawn.length; done++) {
    for (const { dx, dy } of around) {
      const x = drawn[done].x + dx,
        y = drawn[done].y + dy;
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        !visited.has(x + "," + y) &&
        state.picture.pixel(x, y) == targetColor
      )
        drawn.push({ x, y, color: state.color });
      visited.add(x + "," + y);
    }
  }
  dispatch({ picture: state.picture.draw(drawn) });
}

function pick(pos: pos, state: State, dispatch: dispatch) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}

export { draw, rectangle, fill, pick };
