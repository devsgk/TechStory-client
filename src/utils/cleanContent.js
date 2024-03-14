export function addIndent(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const alignClasses = ["text-left", "text-center", "text-right"];
  const listTypes = ["list-decimal", "list-disc"];
  const paddingClasses = ["pl-[40px]"];

  function removeAllAlignClasses(element) {
    alignClasses.forEach((el) => element.classList.remove(el));
  }

  function removeAllListClasses(element) {
    listTypes.forEach((el) => element.classList.remove(el));
    paddingClasses.forEach((el) => element.classList.remove(el));
  }

  doc.querySelectorAll("ol, ul").forEach((list) => {
    removeAllListClasses(list);

    if (list.tagName.toLowerCase() === "ol") {
      list.classList.add("list-decimal", "pl-[40px]");
    } else if (list.tagName.toLowerCase() === "ul") {
      list.classList.add("list-disc", "pl-[40px]");
    }
  });

  doc.querySelectorAll('[style*="text-align: left"]').forEach((el) => {
    removeAllAlignClasses(el);

    el.classList.add("text-left");
    el.removeAttribute("style");
  });

  doc.querySelectorAll('[style*="text-align: center"]').forEach((el) => {
    removeAllAlignClasses(el);
    el.classList.add("text-center");

    el.removeAttribute("style");
  });

  doc.querySelectorAll('[style*="text-align: right"]').forEach((el) => {
    removeAllAlignClasses(el);
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
