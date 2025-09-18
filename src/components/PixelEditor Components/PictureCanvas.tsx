import { useEffect, useRef } from "react";
import { SCALE } from "../../settings";
import { pointerPosition } from "../../utility/utilityFunctions";
import Picture from "../../classes/Picture";

type pos = {
  x: number;
  y: number;
};

interface PictureCanvas {
  picture: Picture;
  pointerDown: (pos: pos) => ((pos: pos) => void) | undefined;
  previous: Picture;
}

export default function PictureCanvas({
  picture,
  pointerDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  previous,
}: PictureCanvas) {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  const mouse = (
    downEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    onDown: (pos: pos) => ((pos: pos) => void) | undefined
  ): void => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      if (downEvent.button != 0) return;
      let pos = pointerPosition(downEvent, canvasElement);
      const onMove = onDown(pos);
      if (!onMove) return;

      const move = (moveEvent: MouseEvent) => {
        if (canvasRef.current) {
          if (moveEvent.buttons == 0) {
            canvasElement.removeEventListener("mousemove", move);
          } else {
            const newPos = pointerPosition(moveEvent, canvasElement);
            if (newPos.x == pos.x && newPos.y == pos.y) return;
            pos = newPos;
            onMove(newPos);
          }
        }
      };
      canvasElement.addEventListener("mousemove", move);
    }
  };

  const touch = (
    startEvent: React.TouchEvent<HTMLCanvasElement>,
    onDown: (pos: pos) => ((pos: pos) => void) | undefined
  ) => {
    if (canvasRef.current) {
      const theTouch = startEvent.touches[0];
      const canvasElement = canvasRef.current;
      let pos = pointerPosition(theTouch, canvasElement);
      const onMove = onDown(pos);
      startEvent.preventDefault();
      if (!onMove) return;
      const move = (moveEvent: TouchEvent) => {
        const newPos = pointerPosition(moveEvent.touches[0], canvasElement);
        if (newPos.x == pos.x && newPos.y == pos.y) return;
        pos = newPos;
        onMove(newPos);
      };

      const end = () => {
        canvasElement.removeEventListener("touchmove", move);
        canvasElement.removeEventListener("touchend", end);
      };
      canvasElement.addEventListener("touchmove", move);
      canvasElement.addEventListener("touchend", end);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      const cx = canvasElement.getContext("2d");

      if (cx === null) throw new Error("cx is null!");

      for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
          // const color = picture.pixel(x, y);
          // if (previous == null || previous.pixel(x, y) != color) {
          cx.fillStyle = picture.pixel(x, y);
          cx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          // }
        }
      }
    }
  });

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={(ev) => mouse(ev, pointerDown)}
      onTouchStart={(ev) => touch(ev, pointerDown)}
      width={picture.width * SCALE}
      height={picture.height * SCALE}
    ></canvas>
  );
}
