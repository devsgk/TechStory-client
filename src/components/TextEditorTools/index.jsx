import React, { useState } from "react";
import { AiOutlineOrderedList } from "react-icons/ai";
import { BiFontSize } from "react-icons/bi";
import { CgColorBucket } from "react-icons/cg";
import {
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiItalic,
  FiList,
  FiUnderline,
} from "react-icons/fi";
import { RiMarkPenLine } from "react-icons/ri";
import { ColorPicker, FontDropDown } from "../TextEditorUtilsComponent";
import TextEditorCommands from "../../utils/TextEditorCommands";

export default function TextEditorTools() {
  const [isPaintingBackground, setIsPaintingBackground] = useState(false);
  const [isPaintingText, setIsPaintingText] = useState(false);
  const [isChangingFontSize, setIsChangingFonstSize] = useState(false);

  const commands = new TextEditorCommands();

  return (
    <>
      <div className="flex customButtons">
        <button className="" onClick={() => commands.bold()}>
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

        <button onClick={(e) => setIsPaintingBackground((prev) => !prev)}>
          <CgColorBucket className="border-b-[3px] h-7 border-b-red-500" />
          {isPaintingBackground && (
            <div className="absolute left-1/2 ml-[-14px] mt-[-115px] z-10">
              <ColorPicker fn={(s) => commands.bgColor(s)} />
            </div>
          )}
        </button>

        <button onClick={() => setIsPaintingText((prev) => !prev)}>
          <RiMarkPenLine className="border-b-[3px] h-7 border-b-red-500" />
          {isPaintingText && (
            <div className="absolute left-1/2 ml-[10px] mt-[-115px] z-10">
              <ColorPicker
                state={setIsPaintingText}
                fn={(s) => commands.color(s)}
              />
            </div>
          )}
        </button>

        <button onClick={() => setIsChangingFonstSize((prev) => !prev)}>
          <BiFontSize />
          {isChangingFontSize && (
            <FontDropDown fn={(n) => commands.fontSize(n)} />
          )}
        </button>
      </div>
    </>
  );
}
