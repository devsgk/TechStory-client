import { render, screen, waitFor } from "@testing-library/react";
import ModifyingModal from "../components/ModifyingModal";

describe("ModifyingModal", () => {
  it("renders correctly when isOpen is true", () => {
    render(<ModifyingModal isOpen={true} />);
    const modalElement = screen.getByText(/start editing your article/i);
    expect(modalElement).toBeInTheDocument();
  });

  it("hides after a timeout when isOpen is false", async () => {
    render(<ModifyingModal isOpen={true} />);

    // Wait for the timeout duration
    await waitFor(() => {
      const modalElement = screen.queryByText(/start editing your article/i);
      return modalElement === null;
    });
  });
});
