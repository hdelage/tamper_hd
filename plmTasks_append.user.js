/*globals MY_LIB*/
// ==UserScript==
// @name         plmTasks_append
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow fast edit of project names
// @author       Hugo Delage
// @updateURL    https://github.com/mygithubaccount/test/raw/master/test.user.js
// @downloadURL  https://github.com/mygithubaccount/test/raw/master/test.user.js
// @match        https://hut2019x.plm.marquez.ca:444/3dspace/common/*emxPortalDisplay.jsp?*
// @icon         https://hut2019x.plm.marquez.ca:444/3dspace/favicon.ico
// @run-at       document-idle
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

function apply_pattern(){
    console.log("Application du pattern")
//document.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected') --> all selected elements


    //var tw = unsafeWindow.window[0];
    var PMC = unsafeWindow.open("","PMCWBS");
    var curdoc = PMC.document
    var hd_txt = curdoc.querySelector('#HDTaskText').value;
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
           modifyElem(sel[i],hd_txt,curdoc, PMC)
       } catch (e) {
       console.log(e);
       wait(100)
       break;}
    }
    if (aserror) {
       sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')
       for(let i in sel) {
           try {
               modifyElem(sel[i],hd_txt,curdoc, PMC)
           } catch (e) {
               console.log(e);
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


//function inputText(txt,row){
    //todelete
    // call emxUIFreezePane.js --> getCell(arguments) --> (1) -->arguments[0] = pointerEvent = document.body.dispatchEvent(event) trouver l'event?
    // si on utilise plusieurs elements, il semble y avoir de quoi==> targetNode = tblBody.rows(arg0).cells(args(1))
    //
    // set current cell = ref --> emxEditableTable.getCurrentCell
    //var colName = colMap.getColumnByIndex(currentColumnPosition-1).getAttribute("name");
    //getTotalCellInfo(currentRow,colName);

    //tcell(row,1)

  //  var name = "formfield" + new Date().getTime();
   // var floatingDiv = document.createElement("div");
   // floatingDiv.className = "formLayer";
  //  document.forms[0].appendChild(floatingDiv);
   //ocument.forms[0].elements[name] = formfield;

 //   var inp = document.createElement("input")
 //   const attributes = {
   //     id: 'processing',
   //     type: 'text',
   //     value: txt,

        //onclick: 'apply_pattern()', ---> error not defined use event listener
    //    name: "formfield1648230196327"
  //      };
    //    setAttributes(inp,attributes)
 //   return inp}


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


        // AJOUT BOUTTON
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
        // get last element after _ in title
        var _title = curdoc.querySelector(".root-node.even > .mx_editable > div > table > tbody > tr > td[title] > a").text.split("_").slice(-1)[0];
        //document.querySelector(".root-node.even > .mx_editable > div > table > tbody > tr > td[title] > a").text.split("_").slice(-1)[0];
        inp.id = "HDTaskText"
        inp.value = _title

        intd.appendChild(inp);
        massupdate_bar.appendChild(intd);

        //$("#HDTaskButton").click (apply_pattern); //jquery event listerer on click
        console.log(massupdate_bar)
        console.log('--------------------ajout du boutton -------------------');

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



//quand on entre en edit mode, le style de l'item divMassUpdate passe de display: none; --> display: block;


// lorsque clic dans une case, il appèle emxUIFreezePane.js ===> dans les eaux de 4672 ---> prend le field
    //function getCell()
    //getField(targetNode, inputType, objColumn, value, rowId);



//document.querySelector("#\\30 \\,0\\,0 > td.mx_editable.mx_edited").click() --> click on task
//document.querySelector("body > form:nth-child(5) > div.formLayer > input").value="test" --> set value of the task

// var context = document.querySelector("#content").querySelector("iframe")contentDocument

// var portal = document.querySelector(".structure-content[style='display: block;'] > iframe").contentDocument.querySelector("iframe").contentDocument
// var portal = document.querySelectorAll('iframe[src^=".."]')[0].contentDocument.querySelector("iframe").contentDocument
// var curdoc = portal.querySelector("#div.PvChannel-1-1 > div.pv-channel-content[style=''] > iframe").contentDocument
// var curdoc = document.querySelectorAll('iframe[src^=".."]')[0].contentDocument
// var sel = curdoc.querySelector('#treeBodyTable').querySelectorAll('.mx_rowSelected')
//apeendParametersInSubmitFormeditableTable
// function updateText(objElem,obj, rowid) 6493 dams emxUIFreezepane ---> objElem = sel[x] (td?)  , obj = <input type="text" value="PJ_PROJET_BRAINSTORM" name="formfield1648230196327">, Rowid = "0,0,0"
// var theValidator = theColumn.getSetting("Validate") --> a tester