import { createElement } from "react";

interface config {
  dispatch: ({ color }: { color: string }) => void;
}

export default class ColorSelect {
  dom: React.DetailedReactHTMLElement<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  >;
  input: React.DetailedReactHTMLElement<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;

  constructor(state: { color: string }, { dispatch }: config) {
    this.input = createElement("input", {
      type: "color",
      value: state.color,
      onChange: () => {
        const theColor = this.input.props.value;
        if (typeof theColor === "string") return dispatch({ color: theColor });
        else throw new Error("theColor is not a string!");
      },
    });

    this.dom = createElement("label", null, "Color: ", this.input);
  }

  syncState(state: { color: string }) {
    this.input.props.value = state.color;
  }
}
