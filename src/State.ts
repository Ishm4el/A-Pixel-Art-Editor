import Picture from "./Picture";

type action = { [key: string]: string };
export type tool = "fill" | "pick" | "rectangle" | "draw";

interface Class {
  tool: tool;
  color: string;
  picture: Picture;
  action?: action;
}

export default class State {
  tool: tool;
  color: string;
  picture: Picture;
  action?: action;

  constructor({ tool, color, picture, action }: Class) {
    this.tool = tool;
    this.color = color;
    this.picture = picture;
    if (action) this.action = action;
  }
}
