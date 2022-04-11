// ==UserScript==
// @name         Colapse Projects
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  colapse all project in timesheets
// @author       You
// @updateURL    http://github.com/hdelage/tamper_hd/raw/main/plm_Proj_timesheet_colapse.js
// @downloadURL  http://github.com/hdelage/tamper_hd/raw/main/plm_Proj_timesheet_colapse.js
// @match        https://hut2019x.plm.marquez.ca:444/3dspace/common/emxNavigatorDialog.jsp
// @icon         https://eu1-ds-iam.3dexperience.3ds.com/3DPassport/resources-220127130842/img/favicon/favicon-32x32.png
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

console.log('-------------------INIT Colapsing projects -------------------');



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
    console.log('--------------------Colapsing project loaded -------------------');
    setTimeout(function() {
        console.log('-------------------- spinner start -------------------');

       addClassNameListener('spinner_div1',function(){
            console.log('-------------------- spinner end -------------------');
        var elm = unsafeWindow.document.getElementsByClassName('rg1 heading')
        for (const e of elm) {
            console.log(e.id);
            unsafeWindow.toggleRowGrouping(e.id);
        };
            console.log('-------------------Colapsing project end   -------------------');
        });
    }, 2000); //1.5 seconds will elapse and Code will execute.

});
