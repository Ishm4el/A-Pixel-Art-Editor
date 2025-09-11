import { createElement, type DetailedReactHTMLElement } from "react";
import type Picture from "./Picture";
import { draw, fill, pick, rectangle } from "./tools";

interface config {
  tools: {
    draw: typeof draw;
    fill: typeof fill;
    pick: typeof pick;
    rectangle: typeof rectangle;
  };
  dispatch: (action: { [key: string]: string }) => void;
}

export default class ToolSelect {
  dom: React.ReactNode;
  select: DetailedReactHTMLElement<
    {
      onChange: () => void;
      value: string;
    },
    HTMLElement
  >;

  constructor(
    state: { tool: string; color: string; picture: Picture },
    { tools, dispatch }: config
  ) {
    this.select = createElement(
      "select",
      {
        onChange: () => dispatch({ tool: this.select.props.value }),
        value: state.tool,
      },
      ...Object.keys(tools).map((name) => createElement("option", {}, name))
    );
    this.dom = createElement("label", null, "Tool: ", this.select);
  }

  syncState(state: { tool: string }) {
    this.select.props.value = state.tool;
  }
}
