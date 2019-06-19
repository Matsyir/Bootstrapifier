/*
* Copyright (c) 2019 Matsyir https://github.com/Matsyir https://Matsyir.com
* MIT License

* Bootstrapifier
* Parse basic HTML and add simple bootstrap classes to make the page look nicer at the click of a button.
* Dependencies: DOMParser, jQuery (made with 3.4.1), Bootstrap (automatically linked)
*/

class Bootstrapifier
{
  // Constants. Note: accessed without (), like a field.
  static get BOOSTRAP_CSS_URL() { return "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"; }
  static get GENERATED_PAGE_COMMENT() { return "Page generated with Bootstrapifier - https://github.com/Matsyir/Bootstrapifier - MIT License"; }
  static get DEFAULT_ROW_ELEMENTS() { return []; }
  static get DEFAULT_TEXT_CENTER_ELEMENTS() { return ["h1", "h2", "h3", "h4", "h5", "ul", "ol"]; }
  static DARK_THEME_CSS(indent) { return `
  <style>
  ${indent}body, li, textarea, input[type="text"] {
  ${indent.repeat(2)}background-color:#222221 !important;
  ${indent.repeat(2)}color: #EEEEEF !important;
  ${indent}}
  </style>
  `}
  
  // The main html processing function that adds Bootstrap classes to certain elements.
  static bootstrapify(htmlDocumentString,
    wrapBodyInContainer=true,
    elementTagsToWrapRow=Bootstrapifier.DEFAULT_ROW_ELEMENTS,
    elementTagsToCenterText=Bootstrapifier.DEFAULT_TEXT_CENTER_ELEMENTS,
    addBasicDarkTheme=true,
    applyListGroups=true,
    halfWidthCenterListGroups=true,
    indentSize=4,
    debug=true,
    debugMaxHtmlNodes=1000,
    callback=null)
  {
    // allow skipping optional params and keeping default values by passing undefined or null.
    if (wrapBodyInContainer == undefined) { wrapBodyInContainer = true }
    if (elementTagsToWrapRow == undefined) { elementTagsToWrapRow = Bootstrapifier.DEFAULT_ROW_ELEMENTS }
    if (elementTagsToCenterText == undefined) { elementTagsToCenterText = Bootstrapifier.DEFAULT_TEXT_CENTER_ELEMENTS }
    if (addBasicDarkTheme == undefined) { addBasicDarkTheme = true }
    if (applyListGroups == undefined) { applyListGroups = true }
    if (indentSize == undefined) { indentSize = 4 }
    if (debug == undefined) { debug = true }
    if (debugMaxHtmlNodes == undefined) { debugMaxHtmlNodes = 1000 }
    // callback can stay null

    function log(msg) {
      if (debug) {
        console.log(msg);
      }
    }
    
    log("Starting Bootstrapify process...");
    let HTMLNodeCollection = (new DOMParser()).parseFromString(htmlDocumentString, "text/html").all;
    log("Done parsing HTML code to HTML nodes. Applying Bootstrap...");

    let indent = " ".repeat(indentSize);
    elementTagsToWrapRow = elementTagsToWrapRow.map((e) => { return e.toLowerCase(); });
    elementTagsToCenterText = elementTagsToCenterText.map((e) => { return e.toLowerCase(); });
    
    // Convert HTML Node collection to regular array, so that we only work with
    // the initial nodes and the array doesn't get expanded when we add new elements.
    let HTMLNodes = [];
    for(let i = 0; i < HTMLNodeCollection.length; i++)
    {
      HTMLNodes.push(HTMLNodeCollection[i]);
    }

    for(let i = 0; i < HTMLNodes.length; i++)
    {
      let lowercaseTagName = HTMLNodes[i].tagName.toLowerCase();
      log(`Processing HTML Node #${i.toString()} (${lowercaseTagName})`);
      if (debug && i > debugMaxHtmlNodes) {
        log(`Processed max number of HTML elements (debug configuration). Manually quitting.`);
      }

      if (elementTagsToWrapRow.includes(lowercaseTagName)) {
        HTMLNodes[i].outerHTML=`<div class="row">${HTMLNodes[i].outerHTML}</div>`;
      }
      if (elementTagsToCenterText.includes(lowercaseTagName)) {
        HTMLNodes[i].classList.add("text-center");
      }

      // depending on the tag name, perform different actions. Mostly,
      // adding a Bootstrap class to improve formatting.
      switch (lowercaseTagName)
      {
        case "html": // add Bootstrapifier comment to the top of the html tag (can be removed)
            let bootstrapifierComment = document.createComment(Bootstrapifier.GENERATED_PAGE_COMMENT);
            HTMLNodes[i].prepend(bootstrapifierComment);
        break;
        case "head": // append bootstrap link reference in the head
          let bootstrapLinkNode = document.createElement("link");
          bootstrapLinkNode.setAttribute("rel", "stylesheet");
          bootstrapLinkNode.setAttribute("type", "text/css");
          bootstrapLinkNode.setAttribute("href", Bootstrapifier.BOOSTRAP_CSS_URL);
          HTMLNodes[i].appendChild(bootstrapLinkNode);

          if (addBasicDarkTheme) {
            $(HTMLNodes[i]).append(Bootstrapifier.DARK_THEME_CSS(indent));
          }
        break;
        case "body":
          if (wrapBodyInContainer) { // wrap body with container
            $(HTMLNodes[i]).wrapInner(`<div class="container"></div>`);
          }
        break;
        case "input": // add format classes to inputs
          switch(HTMLNodes[i].type)
          {
            case "button":
              HTMLNodes[i].classList.add("btn", "btn-primary");
            break;
            // case "checkbox": // need to wrap with div for checkbox
            //   HTMLNodes[i].classList.add("form-check-input");
            // break;
            case "file":
              HTMLNodes[i].classList.add("form-control-file");
            break;
            case "text":
            case "number":
            case "email":
            case "password":
            case "date":
            case "time":
              HTMLNodes[i].classList.add("form-control");
            break;
          }
        break;
        case "textarea":
        case "select":
          HTMLNodes[i].classList.add("form-control");
        break;
        case "ul":
        case "ol":
          if (applyListGroups) {
            HTMLNodes[i].classList.add("list-group");
            if (halfWidthCenterListGroups) {
              HTMLNodes[i].classList.add("w-50", "ml-auto", "mr-auto");
            }
          }
        break;
        case "li":
          HTMLNodes[i].classList.add("list-group-item");
        break;
      }
    }

    if (typeof callback == "function") {
      callback();
    }
    log("Completed Bootstrapify process. The code output was returned.")
    return Bootstrapifier.improveFormatting(HTMLNodes[0].outerHTML, indent);
  }

  // Attempt to make the output nicer by fixing some of the indenting issues introduced
  // by simply adding HTML nodes to a collection and getting the resulting HTML.
  static improveFormatting(htmlStr, indent) {
    // TODO: actually implement this
    htmlStr = htmlStr.replace("<html><!--", `<html>\n<!--`);
    htmlStr = htmlStr.replace("--><head>", "-->\n<head>");
    htmlStr = htmlStr.replace(`<body><div class="container">`, `<body>\n${indent}<div class="container">`);
    htmlStr = htmlStr.replace(`</div></body></html>`, `${indent}</div>\n</body>\n</html>`);

    return htmlStr;
  }
}