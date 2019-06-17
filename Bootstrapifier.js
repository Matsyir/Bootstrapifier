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
  static get DEFAULT_ROW_ELEMENTS() { return ["textarea", "select", "h1", "h2", "h3", "h4", "h5"]; }
  static get DEFAULT_TEXT_CENTER_ELEMENTS() { return ["h1"]; }
  
  // The main html processing function that adds Bootstrap classes to certain elements.
  static bootstrapify(htmlDocumentString,
    wrapBodyInContainer=true,
    elementTagsToWrapRow=Bootstrapifier.DEFAULT_ROW_ELEMENTS,
    elementTagsToCenterText=Bootstrapifier.DEFAULT_TEXT_CENTER_ELEMENTS,
    addBasicDarkTheme=true,
    indentSize=4,
    debug=true)
  {
    // allow skipping optional params and keeping default values by passing undefined or null.
    if (wrapBodyInContainer == undefined) { wrapBodyInContainer = true }
    if (elementTagsToWrapRow == undefined) { elementTagsToWrapRow = Bootstrapifier.DEFAULT_ROW_ELEMENTS }
    if (elementTagsToCenterText == undefined) { elementTagsToCenterText = Bootstrapifier.DEFAULT_TEXT_CENTER_ELEMENTS }
    if (addBasicDarkTheme == undefined) { addBasicDarkTheme = true }
    if (indentSize == undefined) { indentSize = 4 }
    if (debug == undefined) { debug = true }

    function log(msg) {
      if (debug) {
        console.log(msg);
      }
    }
    
    log("Starting Bootstrapify process...");
    let HTMLNodeCollection = (new DOMParser()).parseFromString(htmlDocumentString, "text/html").all;
    log("Successfully parsed HTML code to HTML nodes. Applying bootstrap...");

    let indent = " ".repeat(indentSize);
    elementTagsToWrapRow = elementTagsToWrapRow.map((e) => { return e.toLowerCase(); });
    
    // elementTagsToWrapRow.forEach(function(element) {
    //   $(element).wrap(`<div class="row"></div>`);
    // });
    elementTagsToCenterText.forEach(function(element) {
      $(element).addClass("text-center");
    });

    
    let HTMLNodes = [];
    for(let i = 0; i < HTMLNodeCollection.length; i++)
    {
      HTMLNodes.push(HTMLNodeCollection[i]);
    }

    for(let i = 0; i < HTMLNodes.length; i++)
    {
      log(`Processing HTML Node #${i.toString()} (${HTMLNodes[i].tagName.toLowerCase()})`);
      if (i > 1000) {
        log("Processed over 1000 HTML elements. Manually quitting.");
      }

      if (elementTagsToWrapRow.includes(HTMLNodes[i].tagName.toLowerCase())) {
        $(HTMLNodes[i]).wrap(`<div class="row"></div>`);
      }
      // if (elementTagsToCenterText.includes(HTMLNodes[i].tagName.toLowerCase())) {
      //   HTMLNodes[i].classList.add("text-center");
      // }

      // depending on the tag name, perform different actions. Mostly,
      // adding a Bootstrap class to improve formatting.
      switch (HTMLNodes[i].tagName.toLowerCase())
      {
        case "head": // append bootstrap link reference in the head
          let bootstrapLinkNode = document.createElement("link");
          bootstrapLinkNode.setAttribute("rel", "stylesheet");
          bootstrapLinkNode.setAttribute("type", "text/css");
          bootstrapLinkNode.setAttribute("href", Bootstrapifier.BOOSTRAP_CSS_URL);
          HTMLNodes[i].appendChild(bootstrapLinkNode);

          if (addBasicDarkTheme) {
          // body {
          //     background-color:#222221 !important;
          //     color: #EEEEEF !important;
          // }
            $(HTMLNodes[i]).append(`\n<style>\n${indent}body {\n${indent.repeat(2)}background-color:#222221 !important;\n${indent.repeat(2)}color: #EEEEEF !important;\n${indent}}\n</style>\n`);            //HTMLNodes[i].insertAdjacentHTML("beforeend", 
          }
        break;
        case "body":
          if (wrapBodyInContainer) { // wrap body with container
            $(HTMLNodes[i]).wrapInner(`\n${indent}<div class="container"></div>`);
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
        // TODO: List, add params/settings
      }
    }

    return Bootstrapifier.fixIndenting(HTMLNodes[0].outerHTML);
  }

  // Attempt to make the output nicer by fixing some of the indenting issues introduced
  // by simply adding HTML nodes to a collection and getting the resulting HTML.
  static fixIndenting(htmlStr) {
    // TODO: actually implement this
    return htmlStr;
  }
}