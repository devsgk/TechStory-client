import { useEffect, useState } from "react";
import "./styles.css";

export default function SavedModal({ isOpen }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, 2300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const animationClass = show ? "animate-show" : "animate-hide";

  return (
    <div className={`modal2 ${animationClass}`}>
      <p>Successfully Saved!</p>
    </div>
  );
}
