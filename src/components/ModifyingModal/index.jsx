import { useEffect, useState } from "react";
import "./styles.css";

export default function ModifyingModal({ isOpen }) {
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
    <div className={`modal ${animationClass}`}>
      <p>Start editing your article!</p>
    </div>
  );
}
