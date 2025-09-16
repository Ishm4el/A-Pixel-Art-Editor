import Picture from "./Picture";

type action = { [key: string]: string };
export type tool = "fill" | "pick" | "rectangle" | "draw";

interface Class {
  tool: tool;
  color: string;
  picture: Picture;
  action?: action;

  // undo variables
  done?: Picture[];
  doneAt?: number;
}

export default class State {
  tool: tool;
  color: string;
  picture: Picture;
  action?: action;
  done: Picture[] = [];
  // check
  doneAt: number = 0;

  constructor({ tool, color, picture, action, done, doneAt }: Class) {
    this.tool = tool;
    this.color = color;
    this.picture = picture;
    if (action) this.action = action;
    if (done) this.done = done;
    if (doneAt) this.doneAt = doneAt;
  }
}
