import { createElement } from "react";
import { SCALE } from "./settings";
import { pointerPosition } from "./utilityFunctions";
import type Picture from "./Picture";

type dom = React.ReactElement<
  HTMLCanvasElement,
  string | React.JSXElementConstructor<HTMLCanvasElement>
>;
export default class PictureCanvas {
  dom: dom;
  picture: Picture | undefined;

  constructor(
    picture: Picture,
    pointerDown: (pos: pos) => ((pos: pos) => void) | undefined
  ) {
    const dom = createElement<HTMLCanvasElement>("canvas");
    console.log(dom);

    dom.props.addEventListener("mousedown", (ev) =>
      this.mouse(ev, pointerDown)
    );
    dom.props.addEventListener("touchstart", (ev) =>
      this.touch(ev, pointerDown)
    );

    this.dom = dom;

    this.syncState(picture);
  }

  syncState(picture: Picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    this.#drawPicture(this.picture, this.dom, SCALE);
  }

  #drawPicture(picture: Picture, canvas: dom, scale: number) {
    canvas.props.width = picture.width * scale;
    canvas.props.height = picture.height * scale;
    const cx = canvas.props.getContext("2d");

    if (cx === null) throw new Error("cx is null!");

    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  mouse(
    downEvent: globalThis.MouseEvent,
    onDown: (pos: pos) => ((pos: pos) => void) | undefined
  ): void {
    if (downEvent.button != 0) return;
    let pos = pointerPosition(downEvent, this.dom);
    const onMove = onDown(pos);
    if (!onMove) return;
    const move = (moveEvent: MouseEvent) => {
      if (moveEvent.buttons == 0) {
        this.dom.props.removeEventListener("mousemove", move);
      } else {
        const newPos = pointerPosition(moveEvent, this.dom);
        if (newPos.x == pos.x && newPos.y == pos.y) return;
        pos = newPos;
        onMove(newPos);
      }
    };
    this.dom.props.addEventListener("mousemove", move);
  }

  touch(
    startEvent: TouchEvent,
    onDown: (pos: pos) => ((pos: pos) => void) | undefined
  ) {
    const theTouch = startEvent.touches[0];
    let pos = pointerPosition(theTouch, this.dom);
    const onMove = onDown(pos);
    startEvent.preventDefault();
    if (!onMove) return;
    const move = (moveEvent: TouchEvent) => {
      const newPos = pointerPosition(moveEvent.touches[0], this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    };

    const end = () => {
      this.dom.props.removeEventListener("touchmove", move);
      this.dom.props.removeEventListener("touchend", end);
    };
    this.dom.props.addEventListener("touchmove", move);
    this.dom.props.addEventListener("touchend", end);
  }
}
