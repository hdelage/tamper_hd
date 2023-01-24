/*globals MY_LIB*/
// ==UserScript==
// @name         plmUrl
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Copy current url to clipboard instread of email
// @author       Hugo Delage
// @updateURL    http://amntrd170:3000/Global/plmTamper/raw/branch/main/
// @downloadURL  http://amntrd170:3000/Global/plmTamper/raw/branch/main/
// @match        https://hut2019x.plm.marquez.ca:444/3dspace/*
// @icon         https://eu1-ds-iam.3dexperience.3ds.com/3DPassport/resources-220127130842/img/favicon/favicon-32x32.png
// @run-at       document-idle
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */


function check(elemId) {
  var elem = document.getElementById(elemId);
  return elem.contentDocument
}

function addSubElementListener(elemId, callback) {
    var lastelem = check(elemId);
    window.setInterval( function() {
       var curelem = check(elemId);
        if (curelem !== lastelem) {
            callback();
            lastelem = curelem;
        }
    },1000);
}

console.log('-------------------userscript start -------------------')


$(document).ready(function() { //When document has loaded

//setTimeout(function() {
    addSubElementListener('content', function(){
            var parseurl = unsafeWindow.getPageURL();
        console.log(parseurl);
        if (parseurl != 'about:blank') {
            var fullurl = parseurl ;
            history.pushState("", "", fullurl);
            var linkbutton = document.getElementsByClassName('share')[0];
            linkbutton.style.backgroundColor = "Black";
            console.log("background set");
            console.log('-------------------url changed  -------------------')
        };
    });


//}, 2000); //Ten seconds will elapse and Code will execute.

});

function Handker_work(){
    alert('works');
}