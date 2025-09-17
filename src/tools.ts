import State from "./State";
import { type DispatchFunction } from "./PixelEditor";

type masterState = [State, React.Dispatch<React.SetStateAction<State>>];

function draw(pos: pos, masterState: masterState) {
  function drawPixel(newPos: pos, masterState: masterState) {
    // const drawn = { x, y, color: masterState[0].color };
    const line = drawLine(pos, newPos, masterState[0].color);
    pos = newPos;
    masterState[1]((prev) => {
      const newDrawing = prev.picture.draw(line);
      if (prev.done.length === 0)
        return new State({
          ...prev,
          color: prev.color,
          tool: prev.tool,
          picture: newDrawing,
          done: [prev.picture],
          doneAt: Date.now(),
        });
      else if (prev.doneAt < Date.now() - 1000)
        return new State({
          ...prev,
          color: prev.color,
          tool: prev.tool,
          picture: newDrawing,
          done: [newDrawing, ...prev.done],
          doneAt: Date.now(),
        });
      else
        return new State({
          ...prev,
          color: prev.color,
          tool: prev.tool,
          picture: newDrawing,
        });
    });
  }
  drawPixel(pos, masterState);
  return drawPixel;
}

function drawLine(from: pos, to: pos, color: string) {
  const points = [];
  if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
    if (from.x > to.x) [from, to] = [to, from];
    const slope = (to.y - from.y) / (to.x - from.x);
    for (let { x, y } = from; x <= to.x; x++) {
      points.push({ x, y: Math.round(y), color });
      y += slope;
    }
  } else {
    if (from.y > to.y) [from, to] = [to, from];
    const slope = (to.x - from.x) / (to.y - from.y);
    for (let { x, y } = from; y <= to.y; y++) {
      points.push({ x: Math.round(x), y, color });
      x += slope;
    }
  }
  return points;
}

function line(pos: pos, masterState: masterState, dispatch: DispatchFunction) {
  return (end: pos) => {
    const line = drawLine(pos, end, masterState[0].color);
    dispatch({ picture: masterState[0].picture.draw(line) });
  };
}

function rectangle(
  start: pos,
  masterState: masterState,
  dispatch: DispatchFunction
) {
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
  dispatch: DispatchFunction
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

function pick(pos: pos, masterState: masterState, dispatch: DispatchFunction) {
  dispatch({ color: masterState[0].picture.pixel(pos.x, pos.y) });
}

function circle(
  pos: pos,
  masterState: masterState,
  dispatch: DispatchFunction
) {
  function drawCircle(to: pos) {
    const radius = Math.sqrt((to.x - pos.x) ** 2 + (to.y - pos.y) ** 2);
    const radiusC = Math.ceil(radius);

    const drawn = [];
    for (let dy = -radiusC; dy <= radiusC; dy++) {
      for (let dx = -radiusC; dx <= radiusC; dx++) {
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        if (dist > radius) continue;

        const y = pos.y + dy;
        const x = pos.x + dx;
        if (
          y < 0 ||
          y >= masterState[0].picture.height ||
          x < 0 ||
          x >= masterState[0].picture.width
        )
          continue;

        drawn.push({ x, y, color: masterState[0].color });
      }
      dispatch({ picture: masterState[0].picture.draw(drawn) });
    }
  }
  drawCircle(pos);
  return drawCircle;
}

export { draw, rectangle, fill, pick, line, circle };
