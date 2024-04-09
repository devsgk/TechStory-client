import { render, screen, waitFor } from "@testing-library/react";
import SavedModal from "../components/SavedModal";

describe.skip("SavedModal", () => {
  it("renders correctly when isOpen is true", () => {
    render(<SavedModal isOpen={true} />);
    const modalElement = screen.getByText(/successfully saved/i);
    expect(modalElement).toBeInTheDocument();
  });

  it("hides after a timeout when isOpen is false", async () => {
    render(<SavedModal isOpen={true} />);

    await waitFor(() => {
      const modalElement = screen.queryByText(/successfully saved/i);

      expect(modalElement).not.toBeInTheDocument();
    });
  });
});
