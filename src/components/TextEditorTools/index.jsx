import React, { forwardRef, useRef, useState } from "react";
import { BiFontSize } from "react-icons/bi";
import { CgColorBucket } from "react-icons/cg";
import {
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiItalic,
  FiUnderline,
} from "react-icons/fi";

import { RiMarkPenLine } from "react-icons/ri";
import { ColorPicker, FontDropDown } from "../TextEditorUtilsComponent";
import TextEditorCommands from "../../utils/TextEditorCommands";
import { handleStyleButtonClick } from "../../utils/styleText";

const TextEditorTools = forwardRef((props, ref) => {
  const [isPaintingBackground, setIsPaintingBackground] = useState(false);
  const [isPaintingText, setIsPaintingText] = useState(false);
  const [isChangingFontSize, setIsChangingFonstSize] = useState(false);

  const commands = new TextEditorCommands();

  return (
    <>
      <div className="flex customButtons">
        <button
          onClick={() => {
            commands.bold();
          }}
          aria-label="Bold"
        >
          <FiBold />
        </button>

        <button onClick={() => commands.italic()} aria-label="Italic">
          <FiItalic />
        </button>

        <button onClick={() => commands.underline()} aria-label="Underline">
          <FiUnderline />
        </button>

        <button onClick={() => commands.alignLeft()} aria-label="AlignLeft">
          <FiAlignLeft />
        </button>

        <button onClick={() => commands.alignCenter()} aria-label="AlignCenter">
          <FiAlignCenter />
        </button>

        <button onClick={() => commands.alignRight()} aria-label="AlignRight">
          <FiAlignRight />
        </button>

        <button
          onClick={(e) => {
            setIsPaintingBackground((prev) => !prev);
            setIsPaintingText(false);
            setIsChangingFonstSize(false);
          }}
          aria-label="PaintBackground"
        >
          <CgColorBucket className="border-b-[3px] h-7 border-b-red-500" />
          {isPaintingBackground && (
            <div className="absolute left-1/2 ml-[-14px] mt-[-115px] z-10">
              <ColorPicker
                fn={(s) => commands.bgColor(s)}
                aria-label="ColorPicker"
              />
            </div>
          )}
        </button>

        <button
          onClick={() => {
            setIsPaintingText((prev) => !prev);
            setIsPaintingBackground(false);
            setIsChangingFonstSize(false);
          }}
          aria-label="PaintText"
        >
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

        <button
          onClick={() => {
            setIsChangingFonstSize((prev) => !prev);
            setIsPaintingText(false);
            setIsPaintingBackground(false);
          }}
          aria-label="FontSize"
        >
          <BiFontSize />
          {isChangingFontSize && (
            <div className="absolute mt-[-120px] ml-[-15px] shadow-md rounded-md bg-white w-[50px]">
              <FontDropDown
                fn={(size) => handleStyleButtonClick("fontSize", size)}
              />
            </div>
          )}
        </button>
      </div>
    </>
  );
});

export default TextEditorTools;
