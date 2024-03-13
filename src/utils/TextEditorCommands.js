export default class TextEditorCommands {
  bold() {
    document.execCommand("bold");
  }
  italic() {
    document.execCommand("italic");
  }
  underline() {
    document.execCommand("underline");
  }

  alignLeft() {
    document.execCommand("JustifyLeft", false, "");
  }

  alignRight() {
    document.execCommand("JustifyRight", false, "");
  }

  alignCenter() {
    document.execCommand("JustifyCenter", false, "");
  }

  orderedList() {
    document.execCommand("insertOrderedList");
  }

  unorderedList() {
    document.execCommand("insertUnorderedList");
  }

  color(color) {
    document.execCommand("foreColor", false, color);
  }

  bgColor(color) {
    document.execCommand("backColor", false, color);
  }

  fontSize(n) {
    if (n === "Small") {
      document.execCommand("fontSize", false, String(1));
    } else if (n === "Medium") {
      document.execCommand("fontSize", false, String(3));
    } else if (n === "Large") {
      document.execCommand("fontSize", false, String(5));
    } else if (n === "X-Large") {
      document.execCommand("fontSize", false, String(7));
    }
  }
}
