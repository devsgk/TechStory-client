import React from "react";

const ReviewFormContainer = React.forwardRef(({ children, position }, ref) => {
  const containerStyle = {
    top: `${position.y + 15}px`,
    right: 0,
    position: "absolute",
    zIndex: 1001,
  };

  return (
    <div ref={ref} style={containerStyle}>
      {children}
    </div>
  );
});

export default ReviewFormContainer;
