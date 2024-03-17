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
    <div className="fixed mt-[-120px] ml-[-15px] shadow-md rounded-md bg-white w-[50px]">
      <div className="flex flex-col justify-center items-center w-full">
        {FONT_SIZES.map((el) => (
          <div
            className="hover:text-slate-900 hover:bg-gray-100 text-[15px] flex justify-center items-center w-full py-1"
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
