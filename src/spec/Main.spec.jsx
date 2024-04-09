import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MainPage from "../components/MainPage";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

describe.skip("MainPage", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders correctly", () => {
    render(<MainPage />, { wrapper: BrowserRouter });
    expect(screen.getByText(/stay hungry\./i)).toBeInTheDocument();
    expect(screen.getByText(/start reading/i)).toBeInTheDocument();
  });

  it('scrolls to the main content area on "Start reading" button click', () => {
    global.scrollTo = vi.fn();

    render(<MainPage />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByText(/start reading/i));

    expect(global.scrollTo).toHaveBeenCalled();
  });
});
