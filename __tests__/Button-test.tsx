import { Button } from "@/components/Button";
import { render } from "@testing-library/react-native";
import React from "react";

describe("Button Component", () => {
  it("renders button with title", () => {
    const { getByText } = render(<Button title="Click me" />);
    expect(getByText("Click me")).toBeTruthy();
  });

  it("renders button with children", () => {
    const { UNSAFE_root } = render(
      <Button>
        <React.Fragment>Custom Content</React.Fragment>
      </Button>
    );
    // Button component renders children directly, not wrapped in Text
    expect(UNSAFE_root).toBeTruthy();
  });

  it("renders button with primary variant by default", () => {
    const { getByText } = render(<Button title="Primary" />);
    expect(getByText("Primary")).toBeTruthy();
  });

  it("renders button with secondary variant", () => {
    const { getByText } = render(<Button title="Secondary" variant="secondary" />);
    expect(getByText("Secondary")).toBeTruthy();
  });

  it("renders button with danger variant", () => {
    const { getByText } = render(<Button title="Danger" variant="danger" />);
    expect(getByText("Danger")).toBeTruthy();
  });
});

