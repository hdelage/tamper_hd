/*globals MY_LIB*/
// ==UserScript==
// @name         plmTasks_append
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allow fast edit of project names
// @author       Hugo Delage
// @updateURL    http://github.com/hdelage/tamper_hd/raw/main/plmTasks_append.user.js
// @downloadURL  http://github.com/hdelage/tamper_hd/raw/main/plmTasks_append.user.js
// @match        https://hut2019x.plm.marquez.ca:444/3dspace/common/*emxPortalDisplay.jsp?*
// @icon         https://hut2019x.plm.marquez.ca:444/3dspace/favicon.ico
// @run-at       document-idle
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
//https://hut2019x.plm.marquez.ca:444/3dspace/common/emxTree.jsp?isPopup=true&mode=tree&objectId=22184.4057.22256.57396&DefaultCategory=PMCSchedule

console.log('HD!!!-------------------- project fast edition init -------------------');

var wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(attr => {
    element.setAttribute(attr, attributes[attr]);
  });
}


function check_chanel() {
  var elem = document.querySelector("#pvChannelTabs > table > tbody > tr > td.tab-active");
  return elem.html
}

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




function chanelTabListener(elemId, callback) {
    var lastelem = check_chanel();
    window.setInterval( function() {
       var curelem = check_chanel();
        if (curelem !== lastelem) {
            callback();
            lastelem = curelem;
        }
    },1000);
}

function watch_edit_button(callback) {
    var elem = document.querySelector("#divPvChannel-1-1 > div.pv-channel-content[style=''] > iframe").contentDocument.querySelector('#editButttonId');
    if (elem !== null) {
    window.setInterval( function() {
        if (elem.className === 'icon-button button-active') {
            callback();
            wait(100);
        }
    },10);
    };
}


function remove_pattern(){
     console.log("Retrais du pattern")
    //var tw = unsafeWindow.window[0];
    var PMC = unsafeWindow.open("","PMCWBS");
    var curdoc = PMC.document
    unsafeWindow.queryTxt = curdoc.querySelector('#HDTaskText').value
    var emxUICore = unsafeWindow.emxUICore;
    var oXML = PMC.oXML // get xml data
    var currentRow = null
    var rowId = null
    var aserror = false
    //nsole.log(PMC)
    var sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')

    for(let i in sel) {
       //document.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')[0].querySelector("[id^=icon_] > a > img").src --> icon image
       try {
           if (sel[i].offsetParent === null) {sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')}
           remove_element_pattern(sel[i],curdoc, PMC)
       } catch (e) {
       console.log(e);
       wait(1000);
       remove_pattern;
           //break;
       }
    }
    wait(1000)
    toggle_button()

}

function remove_element_pattern(elem,curdoc, PMC){
    try{
        var rowTD = elem.querySelector("td.mx_editable")
        var curtitle = elem.querySelector('td[title]').textContent
        if (elem.querySelector("[id^=icon_] > a > img").src === 'https://hut2019x.plm.marquez.ca:444/3dspace/common/images/iconSmallTask.png' && curtitle !== "" && curtitle.split("_").length > 1 ) {
            //rename element
            //activate element
            var rowId = elem.getAttribute("id");

            // currentRow = emxUICore.selectSingleNode(oXML, "/mxRoot/rows//r[@id = '" + rowId + "']"); // get all row info
            PMC.getCell(elem.rowIndex,1);
            //tw.getcell(x,1)
            var input = curdoc.querySelector('div.formLayer > input');
            input.value = curtitle.split("_").slice(0,-1).join("_");
            wait(50);
            //document.querySelector("#content").contentDocument.querySelector("#divPvChannel-1-1 > div.pv-channel-content[style=''] > iframe").contentDocument.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected > td.mx_editable')[2].click()
            PMC.updateText(rowTD,input,rowId);


    };
   } catch (e) {
      console.log(e);
   }
}




function apply_pattern(){
    console.log("Application du pattern")
//document.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected') --> all selected elements


    //var tw = unsafeWindow.window[0];
    var PMC = unsafeWindow.open("","PMCWBS");
    var curdoc = PMC.document
    if (curdoc.querySelector('#HDTaskText') !== undefined) {
        unsafeWindow.queryTxt = curdoc.querySelector('#HDTaskText').value }
    console.log(curdoc.querySelector('#HDTaskText') )
    var emxUICore = unsafeWindow.emxUICore;
    var oXML = PMC.oXML // get xml data
    var currentRow = null
    var rowId = null
    var aserror = false

    //nsole.log(PMC)
    var sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')

    for(let i in sel) {
       //document.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')[0].querySelector("[id^=icon_] > a > img").src --> icon image
       try {
           if (sel[i].offsetParent === null) {sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')}
           modifyElem(sel[i],unsafeWindow.queryTxt,curdoc, PMC)
       } catch (e) {
       console.log(e);
       wait(10)
       apply_pattern()
       //break;
       }
    }
    toggle_button()

}

function modifyElem(elem,hd_txt,curdoc, PMC){
    var rowTD = elem.querySelector("td.mx_editable")
    var curtitle = elem.querySelector('td[title]').textContent
     if (elem.querySelector("[id^=icon_] > a > img").src === 'https://hut2019x.plm.marquez.ca:444/3dspace/common/images/iconSmallTask.png' && curtitle !== "" && curtitle.split("_").slice(-1)[0] !== hd_txt ) {
        //rename element
        //activate element
         var rowId = elem.getAttribute("id");

         // currentRow = emxUICore.selectSingleNode(oXML, "/mxRoot/rows//r[@id = '" + rowId + "']"); // get all row info
         PMC.getCell(elem.rowIndex,1)
         //tw.getcell(x,1)
         var input = curdoc.querySelector('div.formLayer > input')
         input.value = curtitle + "_" + hd_txt
         //document.querySelector("#content").contentDocument.querySelector("#divPvChannel-1-1 > div.pv-channel-content[style=''] > iframe").contentDocument.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected > td.mx_editable')[2].click()
         PMC.updateText(rowTD,input,rowId);

    };
}



function toggle_button(){
    var curdoc = document.querySelector("#divPvChannel-1-1 > div.pv-channel-content[style=''] > iframe").contentDocument
    var hdButton = curdoc.querySelector('#HDTaskButton');
    var massupdate_bar = curdoc.querySelector("#divMassUpdate > div > div:nth-child(1) > table > tbody > tr")

    if (hdButton === null && massupdate_bar !== null) {
        // add button,  removed with default plm js?

        // AJOUT SÉPARATEUR
        var sep_td = document.createElement("td");
        var set_div = document.createElement("div");
        set_div.setAttribute('class','separator')
        sep_td.appendChild(set_div);
        massupdate_bar.appendChild(sep_td);


        // AJOUT BOUTTON pattern
        var hdButtontd = document.createElement("td");
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
        var inp = document.createElement("input")
        // get last element after _ in title if not already modified
        if (unsafeWindow.queryTxt == undefined) {
            unsafeWindow.queryTxt = curdoc.querySelector(".root-node.even > .mx_editable > div > table > tbody > tr > td[title] > a").text.split("_").slice(-1)[0];
        }
        //document.querySelector(".root-node.even > .mx_editable > div > table > tbody > tr > td[title] > a").text.split("_").slice(-1)[0];
        inp.id = "HDTaskText"
        inp.value = unsafeWindow.queryTxt

        intd.appendChild(inp);
        massupdate_bar.appendChild(intd);

        // AJOUT BOUTTON remove pattern
        var hdButtontd2 = document.createElement("td");
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


        //$("#HDTaskButton").click (apply_pattern); //jquery event listerer on click
        console.log(massupdate_bar)
        console.log('--------------------ajout du boutton -------------------');

    } else if (hdButton.offsetParent === null) {
        massupdate_bar.appendChild(hdButtontd);
        massupdate_bar.appendChild(intd);
        massupdate_bar.appendChild(hdButtontd2);
        console.log('--------------------ajout du boutton caché -------------------');
    } else {
        console.log('--------------------bouton présent -------------------');
    }

}

$(document).ready(function() { //When document has loaded
    console.log('--------------------project fast edition loaded -------------------');
    setTimeout(function() {
        console.log('--------------------spinner start -------------------');

       addClassNameListener('imgProgressDivChannel',function(){
            console.log('--------------------spinner end -------------------');
            setTimeout(function() {
                //var tabs= document.getElementById('pvChannelTabs')
                //console.log(tabs)
                watch_edit_button( function(){
                    console.log('--------------------edit button activated -------------------');
                    setTimeout(function() {
                        // active désactive le boutton selons le cas

                        toggle_button()

                     }, 200)
                });
                //unsafeWindow.toggleRowGrouping('L0Cancelled');
                //unsafeWindow.toggleRowGrouping('L0Complete');

            }, 2000)
        });
    }, 2000); //1.5 seconds will elapse and Code will execute.

});