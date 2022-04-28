/*globals MY_LIB*/
// ==UserScript==
// @name         plmTasks_append
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Allow fast edit of project names
// @author       Hugo Delage
// @updateURL    http://github.com/hdelage/tamper_hd/raw/main/plmTasks_append.user.js
// @downloadURL  http://github.com/hdelage/tamper_hd/raw/main/plmTasks_append.user.js
// @match        https://*/3dspace/common/emxPortalDisplay.jsp?*
// @icon         https://eu1-ds-iam.3dexperience.3ds.com/3DPassport/resources-220127130842/img/favicon/favicon-32x32.png
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */



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

function qsel_frame(parent,elemId) {
  var elem = parent.querySelector(elemId);
  if (elem === null) {return null} else { return elem.contentDocument };
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
    add_bar()

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
    var emxUICore = unsafeWindow.emxUICore;
    var oXML = PMC.oXML // get xml data
    var currentRow = null
    var rowId = null
    var aserror = false

    //nsole.log(PMC)
    var sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')
    if (sel.length > 0) {
        for(let i in sel) {
            //document.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')[0].querySelector("[id^=icon_] > a > img").src --> icon image
            try {
                if (sel[i].offsetParent === null) {sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')}
                modifyElem(sel[i],unsafeWindow.queryTxt,curdoc, PMC)
            } catch (e) {
                console.log(e);
                wait(10)
                apply_pattern()
            }
        }
    }
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

function update_queryTxt(e){
    unsafeWindow.queryTxt = e.target.value;
}

function add_bar(curdoc){
    console.log('HD!!!-----Ajout de la barre fast edit-----')
    var massupdate_selector = '#divMassUpdate[style="display: block;"] > div > div:nth-child(1) > table > tbody > tr'
    var massupdate_bar = curdoc.querySelector(massupdate_selector)
    var hdButton = curdoc.querySelector('#HDTaskButton');
    var test = toolbar_ensure_element(curdoc,'#divMassUpdate')
    if (hdButton === null && test === null) {
        // AJOUT SÉPARATEUR
        var sep_td = document.createElement("td");
        var set_div = document.createElement("div");
        set_div.setAttribute('class','separator')
        sep_td.appendChild(set_div);
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

function toolbar_ensure_element(parent,elemId){
   var elem = parent.querySelector(elemId)
   if (elem !== null) {
       var mystyle = elem.style.display
       if (mystyle !== "none") {
           return elem.querySelector('#HDButtontd')
       } else {return mystyle} ;
   } else { return "none" }
}


setTimeout(function() {
	console.log('--------------------project fast edition loaded -------------------');
    var iframe_selector = "#divPvChannel-1-1 > div.pv-channel-content[style=''] > iframe"
    var MassupdateBar = '#divMassUpdate'
    addSubElementListener(document,iframe_selector,qsel_frame,function() {
       var iframe_elem = document.querySelector(iframe_selector)
           if (iframe_elem !== null) {
               var iframe_doc = document.querySelector(iframe_selector).contentDocument
               console.log('Frame change')
               addSubElementListener(iframe_doc,MassupdateBar,toolbar_ensure_element,function(){
                   add_bar(iframe_doc);
               },100)
           }
    });
}, 500); //0.5 seconds will elapse and Code will execute.
