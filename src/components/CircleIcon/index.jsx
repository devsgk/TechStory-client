import { CiCirclePlus } from "react-icons/ci";

export default function CircleIcon({ iconPosition, isCircleClicked, onClick }) {
  return (
    <div className="flex">
      <div
        className="absolute mt-[-13px]"
        style={{
          left: iconPosition.x - 40,
          top: iconPosition.y,
        }}
      >
        <CiCirclePlus
          className="cursor-pointer transition-transform duration-300 ease-in-out"
          style={{
            transform: `rotate(${isCircleClicked ? 45 : 0}deg)`,
          }}
          size={30}
          onClick={onClick}
        />
      </div>
    </div>
  );
}
