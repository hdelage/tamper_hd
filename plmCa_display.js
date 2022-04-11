// ==UserScript==
// @name         ca display only nice stuff
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide cancell and complete ca
// @author       Hugo Delage
// @updateURL    http://github.com/hdelage/tamper_hd/raw/main/plmCa_display.js
// @downloadURL  http://github.com/hdelage/tamper_hd/raw/main/plmCa_display.js
// @match        https://hut2019x.plm.marquez.ca:444/3dspace/common/emxIndentedTable.jsp?SuiteDirectory=enterprisechangemgtapp&showPageHeader=true*
// @icon         https://eu1-ds-iam.3dexperience.3ds.com/3DPassport/resources-220127130842/img/favicon/favicon-32x32.png
// @run-at       document-idle
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
console.log('--------------------ca format start -------------------');

function addClassNameListener(elemId, callback) {
    var elem = document.getElementById(elemId);
    var lastClassName = elem.style;
    window.setInterval( function() {
       var className = elem.className;
        if (className !== lastClassName) {
            callback();
            lastClassName = className;
        }
    },10);
}



$(document).ready(function() { //When document has loaded
    console.log('--------------------ca fomat doc loaded -------------------');
    setTimeout(function() {
        console.log('--------------------ca spinner start -------------------');

       addClassNameListener('spinner_div1',function(){
            console.log('--------------------ca spinner end -------------------');
            unsafeWindow.toggleRowGrouping('L0Cancelled');
            unsafeWindow.toggleRowGrouping('L0Complete');
            console.log('-------------------ca format end   -------------------');
        });
    }, 2000); //1.5 seconds will elapse and Code will execute.

});