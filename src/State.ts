import Picture from "./Picture";
type action = { [key: string]: string };
export type tool = "draw" | "fill" | "pick" | "rectangle";

export default class State {
  tool: tool;
  color: string;
  picture: Picture;
  action?: action;

  constructor({
    tool,
    color,
    picture,
    action,
  }: {
    tool: "draw" | "fill" | "pick" | "rectangle";
    color: string;
    picture: Picture;
    action?: action;
  }) {
    this.tool = tool;
    this.color = color;
    this.picture = picture;
    if (action) this.action = action;
  }
}
