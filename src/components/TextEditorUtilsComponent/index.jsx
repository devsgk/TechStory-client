import { COLORS, FONT_SIZES } from "../../constants/textEditorConstants";

export const ColorPicker = ({ fn }) => {
  return (
    <div className="w-44 h-fit border border-slate-300 bg-white rounded-md flex flex-col justify-between shadow-md shadow-slate-200">
      <div className="grid grid-cols-3 w-full h-20 list-none p-0">
        {COLORS.map((el) => (
          <button
            className="w-6 h-6 border rounded-full place-self-center border-neutral-800"
            style={{ background: el }}
            key={el}
            onClick={() => {
              fn(el);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const FontDropDown = ({ fn }) => {
  return (
    <div className="fixed mt-[100px] border rounded-md bg-white drop-shadow-md w-[120px]">
      <div className="flex flex-col justify-center items-center w-[120px]">
        {FONT_SIZES.map((el) => (
          <div
            className="hover:text-slate-900 hover:font-bold text-[15px] w-[120px]"
            key={el}
            onClick={() => fn(el)}
          >
            {el}
          </div>
        ))}
      </div>
    </div>
  );
};
