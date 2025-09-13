import { createContext, useContext } from "react";

export const CanvasContext = createContext<{
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
} | null>(null);

export function useCanvasContext() {
  const canvasContext = useContext(CanvasContext);
  if (!canvasContext)
    throw new Error(
      "canvasContext needs to be used within <CanvasContext.Provider>"
    );
  return canvasContext;
}
