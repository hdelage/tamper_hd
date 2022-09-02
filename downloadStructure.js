// ==UserScript==
// @name         DownloadStructure
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add missing download button for user with error message. will download into intranet folder
// @updateURL    http://github.com/hdelage/tamper_hd/raw/main/downloadStructure.js
// @downloadURL  http://github.com/hdelage/tamper_hd/raw/main/downloadStructure.js
// @author       Hugo Delage
// @match        */3dspace/common/emxForm.jsp?*
// @icon         https://eu1-ds-iam.3dexperience.3ds.com/3DPassport/resources-220127130842/img/favicon/favicon-32x32.png
// @run-at       document-idle
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
console.log('-------------------- Download Structure init -------------------');

var dwnBUrl = 'https://site-assets.fontawesome.com/releases/v6.1.2/svgs/solid/download.svg' // from 3dx new look.
// 3dx = 'https://hut2019x.plm.marquez.ca:444/3dspace/common/images/iconActionDownload.gif' //Icon for download button
//Font Awesome ? https://site-assets.fontawesome.com/releases/v6.1.2/svgs/solid/download.svg

//https://hut2019x.plm.marquez.ca:444/3dspace/components/emxCommonDocumentPreCheckout.jsp?
// action=download&objectId=22184.4057.26831.42207&isExpandFromDEC=true&isRequiredPath=false

var ActionRow = document.getElementById('calc_Actions')
var icons = ActionRow.lastElementChild
var emxUICore = unsafeWindow.emxUICore;



const pathurl = 'http://amntrd170/addin/downloadStructure/'
var params = getAllUrlParams()

var downloadStructure = document.createElement("a")
downloadStructure.id = 'downloadStructureButton'
//downloadStructure.target = 'hiddenFrame'
downloadStructure.href = pathurl + params.objectid

var dImg = document.createElement("img")
dImg.src = dwnBUrl
dImg.Title = "Download Structure"
dImg.border = 0
dImg.height = 16

downloadStructure.appendChild(dImg)
icons.appendChild(downloadStructure)




function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}