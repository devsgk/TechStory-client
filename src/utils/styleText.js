export function applyFontSize(fontSize) {
  const selection = window.getSelection();

  if (!selection.rangeCount || selection.isCollapsed) {
    return;
  }

  const range = selection.getRangeAt(0);
  const newSpan = document.createElement("span");

  newSpan.style.fontSize = `${fontSize}px`;

  const content = range.cloneContents();

  applyFontSizeToNodes(content, `${fontSize}px`);

  range.deleteContents();
  range.insertNode(content);

  function applyFontSizeToNodes(node, fontSize) {
    if (!node.hasChildNodes()) {
      return;
    }

    const children = Array.from(node.childNodes);

    children.forEach((child) => {
      if (
        child.nodeType === Node.TEXT_NODE &&
        child.textContent.trim() !== ""
      ) {
        const span = newSpan.cloneNode();

        span.textContent = child.textContent;

        node.replaceChild(span, child);
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName.toLowerCase() === "span"
      ) {
        child.style.fontSize = fontSize;

        applyFontSizeToNodes(child, fontSize);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        applyFontSizeToNodes(child, fontSize);
      }
    });
  }
}

export function applyBackgroundColor(color) {
  const selection = window.getSelection();

  if (!selection.rangeCount || selection.isCollapsed) {
    return;
  }

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");

  span.style.backgroundColor = color;

  const content = range.cloneContents();

  applyColorToNodes(content, span.style.backgroundColor);

  range.deleteContents();
  range.insertNode(content);

  function applyColorToNodes(node, color) {
    if (!node.hasChildNodes()) {
      return;
    }

    const children = Array.from(node.childNodes);

    children.forEach((child) => {
      if (
        child.nodeType === Node.TEXT_NODE &&
        child.textContent.trim() !== ""
      ) {
        const colorSpan = span.cloneNode();

        colorSpan.textContent = child.textContent;

        node.replaceChild(colorSpan, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName.toLowerCase() === "span") {
          child.style.backgroundColor = color;
        } else {
          applyColorToNodes(child, color);
        }
      }
    });
  }
}

export function applyFontColor(color) {
  const selection = window.getSelection();

  if (!selection.rangeCount || selection.isCollapsed) {
    return;
  }

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");

  span.style.color = color;

  const content = range.cloneContents();

  applyColorToNodes(content, span.style.color);

  range.deleteContents();
  range.insertNode(content);

  function applyColorToNodes(node, color) {
    if (!node.hasChildNodes()) {
      return;
    }

    const children = Array.from(node.childNodes);

    children.forEach((child) => {
      if (
        child.nodeType === Node.TEXT_NODE &&
        child.textContent.trim() !== ""
      ) {
        const colorSpan = span.cloneNode();

        colorSpan.textContent = child.textContent;

        node.replaceChild(colorSpan, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName.toLowerCase() === "span") {
          child.style.color = color;
        } else {
          applyColorToNodes(child, color);
        }
      }
    });
  }
}

export function applyTextAlignment(alignment) {
  const selection = window.getSelection();

  if (selection.rangeCount) {
    const range = selection.getRangeAt(0);
    let alignableParent = getAlignableParentNode(range.commonAncestorContainer);

    if (!alignableParent) {
      const div = document.createElement("div");

      div.style.textAlign = alignment;

      range.surroundContents(div);
    } else {
      alignableParent.style.textAlign = alignment;
    }
  }
}

export function getAlignableParentNode(node) {
  while (node && node !== document) {
    if (
      node.nodeType === 1 &&
      (node.nodeName === "DIV" || node.nodeName === "P")
    ) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

export function toggleTextDecoration(effectType) {
  const selection = window.getSelection();

  if (!selection.rangeCount || selection.isCollapsed) {
    return;
  }

  const range = selection.getRangeAt(0);
  let selectedNode = getSelectedNode();
  let effectTag;

  if (effectType === "bold") {
    effectTag = "strong";
  } else if (effectType === "underline") {
    effectTag = "u";
  } else if (effectType === "italic") {
    effectTag = "em";
  }

  if (
    selectedNode.nodeName.toLowerCase() === effectTag ||
    (selectedNode.parentNode &&
      selectedNode.parentNode.nodeName.toLowerCase() === effectTag)
  ) {
    if (range.toString() !== selectedNode.textContent) {
      applyPartialEffect(range, selectedNode, effectTag);
    } else {
      removeTextEffect(selectedNode, effectTag);
    }
  } else {
    applyTextEffect(range, effectTag);
  }
}

export function getSelectedNode() {
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;

    return node.nodeType === 3 ? node.parentNode : node;
  }

  return null;
}

export function applyTextEffect(range, effectTag) {
  console.log("APPLY");
  const selectionContents = range.extractContents();
  const wrapper = document.createElement(effectTag);

  function preserveStylesAndApplyEffect(node, effectElement) {
    if (node.nodeType === 3) {
      effectElement.appendChild(node.cloneNode());
    } else if (node.nodeType === 1) {
      const clone = document.createElement(node.tagName);

      Array.from(node.attributes).forEach((attr) => {
        clone.setAttribute(attr.name, attr.value);
      });

      Array.from(node.childNodes).forEach((child) => {
        preserveStylesAndApplyEffect(child, clone);
      });

      effectElement.appendChild(clone);
    }
  }

  Array.from(selectionContents.childNodes).forEach((node) => {
    preserveStylesAndApplyEffect(node, wrapper);
  });

  range.deleteContents();
  range.insertNode(wrapper);

  window.getSelection().removeAllRanges();

  const newRange = document.createRange();

  newRange.selectNodeContents(wrapper);
  window.getSelection().addRange(newRange);
}

export function insertMarkersAtSelectionEdges(selection) {
  const range = selection.getRangeAt(0);
  const startMarker = document.createElement("span");
  const endMarker = document.createElement("span");
  startMarker.id = "start-marker";
  endMarker.id = "end-marker";
  startMarker.style.display = "none";
  endMarker.style.display = "none";

  range.insertNode(startMarker);
  range.collapse(false);
  range.insertNode(endMarker);

  selection.removeAllRanges();
  selection.addRange(range);

  return { startMarker, endMarker };
}

export function removeTextEffect(selectedNode, effectTag) {
  const selection = window.getSelection();
  const { startMarker, endMarker } = insertMarkersAtSelectionEdges(selection);

  if (!selection.rangeCount) {
    return;
  }

  let first = null;
  let last = null;

  const preserveStylesAndRemoveEffect = (node, parent) => {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.nodeName.toLowerCase() === effectTag
    ) {
      console.log("1", node.childNodes);
      Array.from(node.childNodes).forEach((child) => {
        preserveStylesAndRemoveEffect(child, parent);
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      console.log("2");
      const clone = document.createElement(node.tagName);

      Array.from(node.attributes).forEach((attr) => {
        clone.setAttribute(attr.name, attr.value);
      });

      Array.from(node.childNodes).forEach((child) => {
        preserveStylesAndRemoveEffect(child, clone);
      });

      parent.appendChild(clone);
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (!first) {
        first = node;
      }

      last = node;

      console.log("3");

      parent.appendChild(node.cloneNode());
    }
  };

  const docFrag = document.createDocumentFragment();

  preserveStylesAndRemoveEffect(selectedNode, docFrag);

  selectedNode.parentNode.replaceChild(docFrag, selectedNode);

  const newRange = document.createRange();
  const newStart = document.getElementById("start-marker");
  const newEnd = document.getElementById("end-marker");

  if (newStart && newEnd) {
    newRange.setStartBefore(newStart);
    newRange.setEndAfter(newEnd);

    newStart.parentNode.removeChild(newStart);
    newEnd.parentNode.removeChild(newEnd);

    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

export function applyPartialEffect(range, selectedNode, effectTag) {
  const selectedText = range.toString();
  const fullText = selectedNode.textContent || "";
  const parentNode = selectedNode.parentNode;

  const beforeText = fullText.substring(0, range.startOffset);
  const afterText = fullText.substring(range.startOffset + selectedText.length);

  let effectNodeBefore;

  if (beforeText.length > 0) {
    effectNodeBefore = document.createElement(effectTag);
    effectNodeBefore.textContent = beforeText;

    parentNode.insertBefore(effectNodeBefore, selectedNode);
  }

  const nonEffectText = document.createTextNode(selectedText);

  parentNode.insertBefore(nonEffectText, selectedNode);

  let effectNodeAfter;

  if (afterText.length > 0) {
    effectNodeAfter = document.createElement(effectTag);
    effectNodeAfter.textContent = afterText;

    parentNode.insertBefore(effectNodeAfter, selectedNode.nextSibling);
  }

  parentNode.removeChild(selectedNode);

  const newRange = document.createRange();

  newRange.selectNodeContents(nonEffectText);

  const selection = window.getSelection();

  selection.removeAllRanges();
  selection.addRange(newRange);
}

export const handleStyleButtonClick = (styleType, value) => {
  switch (styleType) {
    case "color":
      applyFontColor(value);
      break;
    case "backgroundColor":
      applyBackgroundColor(value);
      break;
    case "decoration":
      toggleTextDecoration(value);
      break;
    case "alignment":
      applyTextAlignment(value);
      break;
    case "fontSize":
      applyFontSize(value);
      break;
    default:
      console.log("Unknown style type");
  }
};

export function hasMultilineSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    return false;
  }
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;

  let containsLineBreaks = false;
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (node.nodeName.toLowerCase() === "div") {
          const children = Array.from(node.childNodes);
          if (
            children.length === 1 &&
            children[0].nodeName.toLowerCase() === "br"
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
        }
        return NodeFilter.FILTER_SKIP;
      },
    },
    false,
  );

  while (walker.nextNode()) containsLineBreaks = true;

  return containsLineBreaks;
}

export function handleFileUpload(e, ref) {
  const file = e.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const selection = window.getSelection();

    const img = document.createElement("img");

    img.src = imageUrl;
    img.alt = "Uploaded image";
    img.style.display = "block";
    img.style.margin = "0 auto";
    img.style.resize = "both";
    img.style.overflow = "auto";
    img.style.height = "250px";
    img.style.width = "400px";

    if (selection.rangeCount === 0) {
      ref.current.focus();

      return ref.current.appendChild(img);
    }

    const range = selection.getRangeAt(0);

    range.insertNode(img);
  };

  reader.readAsDataURL(file);
}
