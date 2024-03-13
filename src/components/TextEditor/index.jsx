import { forwardRef, useState } from "react";
import {
  FiItalic,
  FiBold,
  FiUnderline,
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiList,
} from "react-icons/fi";
import { BiFontSize } from "react-icons/bi";
import { AiOutlineOrderedList } from "react-icons/ai";
import { RiMarkPenLine } from "react-icons/ri";
import { CgColorBucket } from "react-icons/cg";

import TextEditorCommands from "../../utils/TextEditorCommands";
import { ColorPicker, FontDropDown } from "../TextEditorUtilsComponent";
import "./style.css";

const TextEditor = forwardRef((props, ref) => {
  const [isPaintingBackground, setIsPaintingBackground] = useState(false);
  const [isPaintingText, setIsPaintingText] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { enableResize = false } = props.properties;
  const commands = new TextEditorCommands();

  return (
    <div
      className={`TextEditor flex flex-col w-full h-[500px] overflow-hidden ${enableResize ? "resize-y" : "resize-none"}`}
    >
      <div className="Buttons">
        <button onClick={() => commands.bold()}>
          <FiBold />
        </button>
        <button onClick={() => commands.italic()}>
          <FiItalic />
        </button>
        <button onClick={() => commands.underline()}>
          <FiUnderline />
        </button>
        <button onClick={() => commands.alignLeft()}>
          <FiAlignLeft />
        </button>
        <button onClick={() => commands.alignCenter()}>
          <FiAlignCenter />
        </button>
        <button onClick={() => commands.alignRight()}>
          <FiAlignRight />
        </button>

        <button onClick={() => commands.orderedList()}>
          <AiOutlineOrderedList />
        </button>
        <button onClick={() => commands.unorderedList()}>
          <FiList />
        </button>
        <button onClick={() => setIsPaintingBackground((prev) => !prev)}>
          <CgColorBucket className="border-b-[3px] h-7 border-b-red-500" />
        </button>
        <button onClick={() => setIsPaintingText((prev) => !prev)}>
          <RiMarkPenLine className="border-b-[3px] h-7 border-b-red-500" />
        </button>
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <BiFontSize />
          {isHovered && <FontDropDown fn={(n) => commands.fontSize(n)} />}
        </button>
      </div>

      {isPaintingBackground && (
        <div className="absolute left-1/2 ml-[100px] mt-[-80px] z-10">
          <ColorPicker fn={(s) => commands.bgColor(s)} />
        </div>
      )}
      {isPaintingText && (
        <div className="absolute left-1/2 ml-[130px] mt-[-80px] z-10">
          <ColorPicker
            state={setIsPaintingText}
            fn={(s) => commands.color(s)}
          />
        </div>
      )}
      <div
        className={`TextareaWrapper w-full h-screen overflow-y-auto ${enableResize ? "resize-y" : "resize-none"}`}
      >
        <div
          className="w-full outline-none p-2 pr-0 break-all h-full min-h-screen overflow-y-auto"
          ref={ref}
          contentEditable
          spellCheck="false"
        />
      </div>
    </div>
  );
});

export default TextEditor;
