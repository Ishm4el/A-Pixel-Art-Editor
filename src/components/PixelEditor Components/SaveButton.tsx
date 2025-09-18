import { useRef } from "react";
import type State from "../../classes/State";

interface SaveButton {
  state: State;
}

export default function SaveButton({ state }: SaveButton) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  return (
    <>
      <button
        onClick={() => {
          const scale = 1;
          const picture = state.picture;
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = picture.width * scale;
            canvas.height = picture.height * scale;
            const cx = canvas.getContext("2d");

            if (!cx) throw new Error("cx is null");

            for (let y = 0; y < picture.height; y++) {
              for (let x = 0; x < picture.width; x++) {
                cx.fillStyle = picture.pixel(x, y);
                cx.fillRect(x * scale, y * scale, scale, scale);
              }
            }

            const link = linkRef.current;
            if (link) {
              link.href = canvas.toDataURL();
              link.download = "pixelart.png";
              link.click();
              link.remove();
            }
          }
        }}
      >
        💾 Save
      </button>
      <canvas ref={canvasRef} hidden={true}></canvas>
      <a hidden={true} ref={linkRef}></a>
    </>
  );
}
