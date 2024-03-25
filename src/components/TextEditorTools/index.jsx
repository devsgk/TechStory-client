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
import { FaImage } from "react-icons/fa";

import { RiMarkPenLine } from "react-icons/ri";
import { ColorPicker, FontDropDown } from "../TextEditorUtilsComponent";
import TextEditorCommands from "../../utils/TextEditorCommands";
import {
  handleFileUpload,
  handleStyleButtonClick,
} from "../../utils/styleText";

const TextEditorTools = forwardRef((props, ref) => {
  const [isPaintingBackground, setIsPaintingBackground] = useState(false);
  const [isPaintingText, setIsPaintingText] = useState(false);
  const [isChangingFontSize, setIsChangingFonstSize] = useState(false);

  const fileInputRef = useRef();

  const commands = new TextEditorCommands();

  return (
    <>
      <div className="flex customButtons">
        <button
          onClick={() => {
            commands.bold();
          }}
        >
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

        <button
          onClick={(e) => {
            setIsPaintingBackground((prev) => !prev);
            setIsPaintingText(false);
            setIsChangingFonstSize(false);
          }}
        >
          <CgColorBucket className="border-b-[3px] h-7 border-b-red-500" />
          {isPaintingBackground && (
            <div className="absolute left-1/2 ml-[-14px] mt-[-115px] z-10">
              <ColorPicker fn={(s) => commands.bgColor(s)} />
            </div>
          )}
        </button>

        <button
          onClick={() => {
            setIsPaintingText((prev) => !prev);
            setIsPaintingBackground(false);
            setIsChangingFonstSize(false);
          }}
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
        >
          <BiFontSize />
          {isChangingFontSize && (
            <div className="absolute mt-[-120px] ml-[-15px] shadow-md rounded-md bg-white w-[50px]">
              <FontDropDown fn={(n) => commands.fontSize(n)} />
            </div>
          )}
        </button>

        <div
          className="flex"
          onClick={(e) => {
            e.stopPropagation();

            fileInputRef.current.click();
          }}
        >
          <button>
            <label
              className="rounded-md text-center m-auto cursor-pointer"
              htmlFor="files"
            >
              <FaImage />
            </label>
            <input
              ref={fileInputRef}
              id="files"
              className="hidden"
              type="file"
              onChange={(e) => {
                handleFileUpload(e, ref);
              }}
            />
          </button>
        </div>
      </div>
    </>
  );
});

export default TextEditorTools;
