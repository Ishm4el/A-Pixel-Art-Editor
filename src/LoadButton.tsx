import { useRef } from "react";
import type { DispatchFunction } from "./PixelEditor";
import Picture from "./Picture";

interface LoadButton {
  dispatch: DispatchFunction;
}
export default function LoadButton({ dispatch }: LoadButton) {
  const loadInputRef = useRef<HTMLInputElement | null>(null);
  const canvasLoadRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const startLoad = () => {
    const loadInput = loadInputRef.current;
    if (loadInput) {
      loadInput.click();
    }
  };

  const pictureFromImage = (image: HTMLImageElement) => {
    const width = Math.min(100, image.width);
    const height = Math.min(100, image.height);

    const canvas = canvasLoadRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;

      const cx = canvas.getContext("2d");
      if (cx) {
        cx.drawImage(image, 0, 0);
        const pixels = [];
        const { data } = cx.getImageData(0, 0, width, height);

        function hex(n: number) {
          return n.toString(16).padStart(2, "0");
        }

        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b] = data.slice(i, i + 3);
          pixels.push("#" + hex(r) + hex(g) + hex(b));
        }

        return new Picture(width, height, pixels);
      }
    }
  };

  const finishLoad = (file: File, dispatch: DispatchFunction) => {
    if (file === null) return;

    const image = imageRef.current;
    if (image) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        image.onload = () => {
          dispatch({ picture: pictureFromImage(image) });
        };
        const readerResult = reader.result;
        if (typeof readerResult === "string") image.src = readerResult;
      });
      reader.readAsDataURL(file);
      console.log("done");
    }
  };

  const inputHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log("in inputHandler");

    const files = ev.target.files;
    if (files) {
      finishLoad(files[0], dispatch);
    }
  };

  return (
    <>
      <button onClick={startLoad}>📁 Loading</button>

      <input
        type="file"
        hidden={true}
        ref={loadInputRef}
        onChange={inputHandler}
      />
      <canvas hidden={true} ref={canvasLoadRef}></canvas>
      <img hidden={true} ref={imageRef} style={{ display: "none" }} />
    </>
  );
}
