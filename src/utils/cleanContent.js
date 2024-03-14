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

export function correctTags(htmlContent) {
  const correctedTags = htmlContent
    .replace(/<br>/g, "<br />")
    .replace(
      /<font color="(.*?)">(.*?)<\/font>/g,
      '<span style="color:$1;">$2</span>',
    )
    .replace(
      /<font color="(.*?)">(.*?)<\/font>/g,
      '<span style="color:$1;">$2</span>',
    )
    .replace(/<div><br><\/div>/g, "")
    .replace(/<div>/g, "<p>")
    .replace(/<\/div>/g, "</p>")
    .replace(/<div><br \/><\/div>/g, "<br />");

  return correctedTags;
}
