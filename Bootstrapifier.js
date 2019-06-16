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
  static get DEFAULT_ROW_ELEMENTS() { return ["input", "textarea", "select", "h1", "h2", "h3", "h4", "h5"]; }
  
  // The main html processing function that
  static bootstrapify(
    htmlDocumentString,
    wrapBodyInContainer=true,
    elementTagsToWrapRow=Bootstrapifier.DEFAULT_ROW_ELEMENTS)
  {
    console.log("Starting Bootstrapify process...");
    let HTMLNodes = (new DOMParser()).parseFromString(htmlDocumentString, "text/html").all;
    console.log("Successfully parsed HTML code to HTML nodes.");
    let resultString = "";
    elementTagsToWrapRow = elementTagsToWrapRow.map((e) => {return e.toLowerCase()});
    
    // elementTagsToWrapRow.forEach(function(element) {
    //   $(element).wrap(`<div class="row"></div>`);
    // });
    for(let i = 0; i < HTMLNodes.length; i++)
    {
      console.log(`Processing HTML Node #${i.toString()} (${HTMLNodes[i].tagName.toLowerCase()})`);

      // if (elementTagsToWrapRow.includes(HTMLNodes[i].tagName.toLowerCase())) {
      //   $(HTMLNodes[i]).wrap(`<div class="row"></div>`);
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
        // TODO: List, add params/settings
      }

      if (i > 1000) {
        "Processed over 1000 HTML elements. Manually quitting."
      }
    }

    return HTMLNodes[0].outerHTML;
  }
}