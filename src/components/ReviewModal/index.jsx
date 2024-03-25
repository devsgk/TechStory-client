import { useUserStore } from "../../store/store";

export default function ReviewModal({
  element,
  hoveredReviewId,
  onMouseEnter,
  onMouseLeave,
  onResolveClick,
}) {
  const { user } = useUserStore();
  const { creator, styleId, comment, position } = element;

  return (
    <div
      className="absolute bg-white p-2 rounded border mr-10 hover:bg-gray-100"
      style={{ top: position.top + 20, right: 0 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      id={styleId}
    >
      <form className="flex flex-col w-[115px]">
        <div className="flex gap-2 mb-2 items-center">
          <img
            className="rounded-full"
            src={creator.photoURL}
            alt="user logo"
            width="20px"
          />
          <div className="flex items-center w-full">
            <p className="text-[12px] font-bold">{creator.displayName}</p>
            {user.email === creator.email && hoveredReviewId === styleId && (
              <div className="ml-auto">
                <img
                  className="w-4 h-4 opacity-20 hover:opacity-100 cursor-pointer"
                  src="/assets/resolveIcon1.png"
                  alt="resolve button"
                  id={styleId}
                  onClick={onResolveClick}
                />
              </div>
            )}
          </div>
        </div>
        <span className="ml-[30px] text-[13px] break-words">{comment}</span>
      </form>
    </div>
  );
}
