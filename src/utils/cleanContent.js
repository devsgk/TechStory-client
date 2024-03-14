export function addIndent(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  doc.querySelectorAll("ol").forEach((ol) => {
    ol.classList.add("list-decimal", "pl-[40px]");
  });

  doc.querySelectorAll("ul").forEach((ul) => {
    ul.classList.add("list-disc", "pl-[40px]");
  });

  doc.querySelectorAll('[style*="text-align: left"]').forEach((el) => {
    el.classList.add("text-left");
    el.removeAttribute("style");
  });

  doc.querySelectorAll('[style*="text-align: center"]').forEach((el) => {
    el.classList.add("text-center");
    el.removeAttribute("style");
  });

  doc.querySelectorAll('[style*="text-align: right"]').forEach((el) => {
    el.classList.add("text-right");
    el.removeAttribute("style");
  });

  return doc.body.innerHTML;
}
