/*globals MY_LIB*/
// ==UserScript==
// @name         plmca_assign
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow fast edit of project names
// @author       Hugo Delage
// @updateURL    http://github.com/hdelage/tamper_hd/raw/main/plmca.js
// @downloadURL  http://github.com/hdelage/tamper_hd/raw/main/plmca.js
// @match        https://*/3dspace/common/emxTableBody.jsp?*portalCmdName=AEFLifecycleApprovals*
// @icon         https://hut2019x.plm.marquez.ca:444/3dspace/favicon.ico
// @run-at       document-idle
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
//https://hut2019x.plm.marquez.ca:444/3dspace/common/emxTree.jsp?isPopup=true&mode=tree&objectId=22184.4057.22256.57396&DefaultCategory=PMCSchedule

console.log('HD!!!-------------------- ca fast assign init -------------------');

//$.getJSON("http://github.com/hdelage/tamper_hd/raw/main/plm_roles.json", function(data) { var plm_roles = data; }); // return json file from network for easy modification of assign

const users={"mat1for":"Mathieu F.",
"hug1del":"Hugo D.",
"ale1urq":"Alex U.",
"ran1mac":"Randy",
"pie1ger":"Pierre G.",
"A0H95322":"Saleem S.",
"jea1rat":"J-S. Ratelle",
"abd1fak":"Abder F.",
"zoz1olg":"Zozane O.",
"fra1tre":"Francois T.",
"mat1leg":"Mathias L.",
"fre1pot":"Fred P.",
"nan1fre":"Nancy F.",
"ala1gau":"Alain G.",
"ale1ber":"Alex B."
}


const roles = {
   "M&P":["mat1for"],
   "CAD":["hug1del","ale1urq","ran1mac","pie1ger"],
   "CHARGÉ DE PROJETS":["A0H95322","jea1rat","abd1fak","zoz1olg"],
   "METHODE":["fra1tre","mat1leg","fre1pot","nan1fre"],
   "CAM":["ala1gau"],
   "PRODUCTION":["ale1ber"]
}

var wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

// taskinfo= id_CA^In Approval^^id_IT^Inbox Task
// txtAssignee = user (ex. admin_platform)
// strExist = business object  Inbox Task IT-0013007 1/n    exists = TRUE
// ITName = IT-00xxxxx
function url_get_assign(evt){
    //taskInfo,notificationComment,txtAssignee,ITName
    var oBt = evt.currentTarget
    var strExists = "business+object++Inbox Task+" + oBt.ITName + "+1\r\n++++existss+%3D+TRUE"
    var payload={"taskInfo":encodeURI(oBt.taskInfo),
                "notificationComment":encodeURI(oBt.notificationComment),
                "txtAssignee":oBt.txtAssignee,
                "searchType":"Person",
               "strExists":strExists}
    var params = new URLSearchParams(payload).toString()
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://hut2019x.plm.marquez.ca:444/3dspace/common/emxLifecycleTaskReassignProcess.jsp?" + params); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
    }


function add_button(doc,otable,user, taskInfo,ITname,comment){

    // création des elements
    var oTr = doc.createElement("tr");
    var oTd = doc.createElement("td");
    var oBt = document.createElement('input');

    const attributes = {
        id: 'AssignTo' + user ,
        type: 'button',
        value: users[user],
        title: "",
        class: 'mx_btn-apply',
    };
    setAttributes(oBt,attributes)

    //set click events and its parameters
    oBt.addEventListener ("click", url_get_assign , false);
    oBt.taskInfo = taskInfo
    oBt.notificationComment = comment
    oBt.txtAssignee = user
    oBt.ITName = ITname

    // finalise append to html
    oTd.appendChild(oBt);
    oTr.appendChild(oTd);
    otable.appendChild(oTr);
}


function assing_user_buttons(){
    console.log('-------------------- adding assign user -------------------');
    //var topdoc = unsafeWindow.top.document
    var listDisplay = window.open("","listDisplay").document
    var elems = listDisplay.querySelectorAll('#AEFLifecycleApprovalsSummary > tbody > tr > td > input')
    if (elems.length > 0) {
        // table formated
        // check | State | Assignee | Task/Signature  | Task Title | Comment/Instruction | action | due Dae | completed date
        // todo  set order dynamic with header

        var tskTitle = undefined

        var assignTable = undefined
        var type=""

        var taskInfo = ""
        var ITname = ""
        var comment = "Réassignation de la tache"

        for (let i = 0; i < elems.length-2; i++) {


            tskTitle = elems[0].parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
            if (tskTitle !== undefined) {

                taskInfo = elems[0].value
                ITname = tskTitle.previousElementSibling.innerText
                type = tskTitle.textContent.trim()
                if (roles[type] !== undefined) {
                    // element exist in json we will add assign buttons here
                    assignTable = listDisplay.createElement("table")
                    tskTitle.appendChild(assignTable)
                    for (let j = 0; j<roles[type].length;j++){
                        //loop thru users and add button
                        add_button(listDisplay,assignTable,roles[type][j],taskInfo,ITname,comment)
}}}}}}

function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(attr => {
    element.setAttribute(attr, attributes[attr]);
  });
}

// wait for specific class element change
function addClassNameListener(elemId, odoc,callback) {
    var elem = odoc.getElementById(elemId);
    var lastClassName = elem.style;
    window.setInterval( function() {
       var className = elem.className;
        if (className !== lastClassName) {
            callback();
            lastClassName = className;
        }
    },10);
}


// after launch and everything is loaded
$(document).ready(function() { //When document has loaded
    console.log('--------------------ca fast assign loaded -------------------');
    setTimeout(function() {
       assing_user_buttons()
   }, 2000);
});

/*
https://www.w3schools.com/js/tryit.asp?filename=tryjs_editor

pour tester le form

<!DOCTYPE html>
<html>
<body>

<button id="viewform" >open form</button>



<script>
function create_form(){
    var popup = open("", "Popup", "width=300,height=200");

    var


    var aOk = popup.document.createElement("a");
    aOk.innerHTML = "Click here";

    popup.document.body.appendChild(txtOk);
    popup.document.body.appendChild(aOk);
}

var button = document.getElementById("viewform");
button.addEventListener ("click", create_form , false);

</script>



</body>
</html>
*/

/*
was a test for added form, but will add button in box instead
function create_form(group){
    var oppener = document
    var popup = open("", "Popup", "width=300,height=200");
    var txtOk = popup.document.createElement("TEXTAREA");
    var aOk = popup.document.createElement("a");
    aOk.innerHTML = "Click here";

    popup.document.body.appendChild(txtOk);
    popup.document.body.appendChild(aOk);

    // to return value to precedent code: https://stackoverflow.com/questions/13301908/open-new-popup-window-and-return-value
    //window.opener['dataitem'] = <your return value>;
    //var somevariable = window['dataitem'];
}*/