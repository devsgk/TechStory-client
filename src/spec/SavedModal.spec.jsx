import { render, screen, waitFor } from "@testing-library/react";
import SavedModal from "../components/SavedModal";

describe("SavedModal", () => {
  it("renders correctly when isOpen is true", () => {
    render(<SavedModal isOpen={true} />);
    const modalElement = screen.getByText(/successfully saved/i);
    expect(modalElement).toBeInTheDocument();
  });
});
