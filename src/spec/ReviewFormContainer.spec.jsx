import { render, screen } from "@testing-library/react";
import React from "react";
import ReviewFormContainer from "../components/ReviewFormContainer";

describe("ReviewFormContainer", () => {
  it("renders children and positions container based on props", () => {
    const position = { y: 100 };
    const TestComponent = () => <div>Test Content</div>;

    const { container } = render(
      <ReviewFormContainer position={position}>
        <TestComponent />
      </ReviewFormContainer>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();

    const reviewFormContainer = container.firstChild;

    expect(reviewFormContainer.style.top).toBe("115px");
    expect(reviewFormContainer.style.right).toBe("0px");
    expect(reviewFormContainer.style.position).toBe("absolute");
    expect(reviewFormContainer.style.zIndex).toBe("1001");
  });

  it("forwards the ref to the DOM element", () => {
    const ref = React.createRef();
    const position = { y: 50 };

    render(<ReviewFormContainer ref={ref} position={position} />);

    expect(ref.current).toBeDefined();
    expect(ref.current.style.top).toBe("65px");
  });
});
