/*
* Copyright (c) 2019 Matsyir https://github.com/Matsyir https://Matsyir.com
* MIT License

* Bootstrapifier
* Parse basic HTML and add simple bootstrap classes to make the page look nicer at the click of a button.
* Using the DOMParser HTML extension, under the bootstrapify function.
*/

class Bootstrapifier
{
  static get BOOSTRAP_CSS_URL() { return "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"; }
  static bootstrapify(htmlDocumentString)
  {
    let HTMLNodes = (new DOMParser()).parseFromString(htmlDocumentString, "text/html").all;
    let resultString = "";
    
    for(let i = 0; i < HTMLNodes.length; i++)
    {
      console.log("processing htmlnode #" + i.toString());
      switch (HTMLNodes[i].tagName.toLowerCase())
      {
        case "head": // insert bootstrap link reference in the head
          let bootstrapLinkNode = document.createElement("link");
          bootstrapLinkNode.setAttribute("rel", "stylesheet");
          bootstrapLinkNode.setAttribute("type", "text/css");
          bootstrapLinkNode.setAttribute("href", Bootstrapifier.BOOSTRAP_CSS_URL);
          HTMLNodes[i].appendChild(bootstrapLinkNode);
        break;
        case "body": // wrap body with container
          // this isn't working
          HTMLNodes[i].htmlDocumentString = `<div class="container">${HTMLNodes[i].htmlDocumentString}</div>`;
          //HTMLNodes[i].insertAdjacentText("afterbegin", );
          //HTMLNodes[i].insertAdjacentHTML("beforeend", "</div>");
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
        console.log("exiting manually");
        break;
      }
      //HTMLNodes[i] = node;
      //resultString.concat(HTMLNodes[i].)
    }

    //HTMLNodes[0].children = HTMLNodes[1];
    return HTMLNodes[0].outerHTML;
  }
}




/*
* DOMParser HTML extension
* 2012-09-04
* 
* By Eli Grey, http://eligrey.com
* Public domain.
* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

/*! @source https://gist.github.com/1129031 */
// https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
/*global document, DOMParser*/
(function(DOMParser) {
  "use strict";
  var proto = DOMParser.prototype, 
  nativeParse = proto.parseFromString;
  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if ((new DOMParser()).parseFromString("", "text/html")) {
      // text/html parsing is natively supported
      return;
    }
  } catch (ex) {}
  proto.parseFromString = function(markup, type) {
    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
      var doc = document.implementation.createHTMLDocument("");
      if (markup.toLowerCase().indexOf('<!doctype') > -1) {
        doc.documentElement.innerHTML = markup;
      }
      else {
        doc.body.innerHTML = markup;
      }
      return doc;
    } else {
      return nativeParse.apply(this, arguments);
    }
  };
}(DOMParser));