// ==UserScript==
// @name         Unlock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add unlock selected in locked document view
// @author       Hugo Delage
// @updateURL    http://amntrd170:3000/Global/plmTamper/raw/branch/main/massUnlock.js
// @downloadURL  http://amntrd170:3000/Global/plmTamper/raw/branch/main/massUnlock.js
// @match        */common/emxIndentedTable.jsp?table=APPDashboardUserDocuments&program=emxDashboardDocuments:getDocuments&mode=Locked*
// @icon         https://eu1-ds-iam.3dexperience.3ds.com/3DPassport/resources-220127130842/img/favicon/favicon-32x32.png
// @run-at       document-idle
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

console.log('HD!!!-------------------- unlock documents -------------------');

var wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

function addSubElementListener(parent,elemId,check,callback,timeStep = 100) {
    var lastelem = check(parent,elemId);
    window.setInterval( function() {
       var curelem = check(parent,elemId);
        if (curelem !== lastelem) {
            callback();
            lastelem = curelem;
        }
    },timeStep);
}

function qsel_frame(parent,elemId) {
  var elem = parent.querySelector(elemId);
  if (elem === null) {return null} else { return elem.contentDocument };
}


function toolbar_ensure_element(parent,elemId){
   var elem = parent.querySelector(elemId)
   if (elem !== null) {
       var mystyle = elem.style.display
       if (mystyle !== "none") {
           return elem.querySelector(elemId)
       } else {return mystyle} ;
   } else { return "none" }
}



function unlock_selected(){
    console.log("Unlock selected elements")
    //var tw = unsafeWindow.window[0];
    var PMC = unsafeWindow.open("","PMCWBS");
    var curdoc = PMC.document
    var emxUICore = unsafeWindow.emxUICore;
    var oXML = PMC.oXML // get xml data
    var currentRow = null
    var rowId = null
    var aserror = false
    var formviewhidden =

    //nsole.log(PMC)
    var sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')
    if (sel.length > 0) {
        for(let i in sel) {
            //document.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')[0].querySelector("[id^=icon_] > a > img").src --> icon image
            try {
                unlock(sel[i].o,formviewhidden)
            } catch (e) {
                console.log(e);
                wait(10)
            }
        }
    }
}

function unlock(id,formviewhidden){
  var url='../integrations/DSCLockUnlockActionProcess.jsp?busDetails=MxCATIAV5|true|' + id + "'|false&Target Location=formViewHidden';return false"
  formviewhidden.location.href= url
  }



function add_bar(curdoc){
    console.log('HD!!!-----Ajout de la barre fast unlock-----')
    var massupdate_selector = 'document.querySelector("#divToolbar > div:nth-child(1) > table > tbody > tr")'
    var massupdate_bar = curdoc.querySelector(massupdate_selector)
    var hdButton = curdoc.querySelector('#HDUnlockButton');
    var test = toolbar_ensure_element(curdoc,'#MassUnlock');
    if (hdButton === null && test === null) {
        // AJOUT Boutton
        var button_td = document.createElement("td");
        button_td.setAttribute('title','Unlock all selected documents');
        button_td.setAttribute('class','icon-button');
        button_td.nowrap = true;

        var button_img = document.createElement("input");
        button_img.setAttribute('data-type','command');
        button_img.setAttribute('src','../iefdesigncenter/images/iconUnLocked.gif');
        button_img.setAttribute('value','Unlock');
        button_img.setAttribute('id','MassUnlock');
        button_img.setAttribute('type','button');
        button_img.addEventListener ("click", unlock_selected , false);


        button_td.appendChild(set_div);
        massupdate_bar.appendChild(sep_td);

        // AJOUT BOUTTON pattern
        var hdButtontd = document.createElement("td");
        hdButtontd.id='HDButtontd'
        var hdButtonhtml = document.createElement('input'); //'<input id="HDTaskButton" type="button" value="Ajout _pattern" onclick="apply_pattern()" class="mx_btn-apply" title="">')
        const attributes = {
            id: 'HDTaskButton',
            type: 'button',
            value: 'Ajout _pattern',
            //onclick: 'apply_pattern()', ---> error not defined use event listener
            title: "",
            class: 'mx_btn-apply',
        };
        setAttributes(hdButtonhtml,attributes)
        hdButtonhtml.addEventListener ("click", apply_pattern , false);

        hdButtontd.appendChild(hdButtonhtml);
        massupdate_bar.appendChild(hdButtontd);

        // ajout du input TXT
        var intd = document.createElement("td")
        intd.id ='HDTaskButton_intd'
        var inp = document.createElement("input")
        // get last element after _ in title if not already modified
        if (unsafeWindow.queryTxt === undefined) {
            var heading = curdoc.querySelector(".root-node.even > .mx_editable > div > table > tbody > tr > td[title] > a")
            if (heading !== null && heading.text.split('_').length > 1){
                unsafeWindow.queryTxt = heading.text.split('_').slice(-1)[0]; // a checker
            }
        }
        inp.addEventListener ("input", update_queryTxt);

        inp.id = "HDTaskText"
        inp.value = unsafeWindow.queryTxt

        intd.appendChild(inp);
        massupdate_bar.appendChild(intd);

        // AJOUT BOUTTON remove pattern
        var hdButtontd2 = document.createElement("td");
        hdButtontd2.id ='hdButtontd2'

        var hdButtonhtml2 = document.createElement('input'); //'<input id="HDTaskButton" type="button" value="Ajout _pattern" onclick="apply_pattern()" class="mx_btn-apply" title="">')
        const attributes2 = {
            id: 'HDTaskButtonRemove',
            type: 'button',
            value: 'Remove',
            //onclick: 'apply_pattern()', ---> error not defined use event listener
            title: "",
            class: 'mx_btn-apply',
        };

        setAttributes(hdButtonhtml2,attributes2)
        hdButtonhtml2.addEventListener ("click", remove_pattern , false);

        hdButtontd2.appendChild(hdButtonhtml2);
        massupdate_bar.appendChild(hdButtontd2);
        console.log('--------------------ajout du boutton -------------------');
    } else if (hdButton !== null && test === null) {
        console.log('HD!!-----ajout du bouton existant au menu')
    } else {
        console.log('--------------------bouton déjà présent -------------------');
    }
}



setTimeout(function() {
	console.log('--------------------project fast edition loaded -------------------');
    var iframe_selector = 'document.querySelector("#divToolbar")'
    var MassUnlock = '#MassUnlock'
    addSubElementListener(document,iframe_selector,qsel_frame,function() {
       var iframe_elem = document.querySelector(iframe_selector)
           if (iframe_elem !== null) {
               var iframe_doc = document.querySelector(iframe_selector).contentDocument
               add_bar(iframe_doc);
           }
    });
}, 500);  //0.5 seconds will elapse and Code will execute.