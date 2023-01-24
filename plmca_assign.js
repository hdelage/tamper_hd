/*globals MY_LIB*/
// ==UserScript==
// @name         plmca_assign
// @namespace    http://tampermonkey.net/
// @version      0.10.2
// @description  Allow fast edit of project names
// @author       Hugo Delage
// @updateURL    http://amntrd170:3000/Global/plmTamper/raw/branch/main/plmca_assign.js
// @downloadURL  http://amntrd170:3000/Global/plmTamper/raw/branch/main/plmca_assign.js
// @match        https://*/3dspace/common/emxTableBody.jsp?*portalCmdName=AEFLifecycleApprovals*
// @icon         https://eu1-ds-iam.3dexperience.3ds.com/3DPassport/resources-220127130842/img/favicon/favicon-32x32.png
// @run-at       document-idle
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
//https://hut2019x.plm.marquez.ca:444/3dspace/common/emxTree.jsp?isPopup=true&mode=tree&objectId=22184.4057.22256.57396&DefaultCategory=PMCSchedule

console.log('HD!!!-------------------- ca fast assign init -------------------');

//$.getJSON("http://amntrd170:3000/Global/plmTamper/raw/branch/main/plm_roles.json", function(data) { var plm_roles = data; }); // return json file from network for easy modification of assign

const users={"mat1for":"Mathieu F.",
"hug1del":"Hugo D.",
"A0h95459":"J-F. G.",
"ran1mac":"Randy",
"pie1ger":"Pierre G.",
"A0H95322":"Saleem S.",
"jea1rat":"J-S. Ratelle",
"abd1fak":"Abder F.",
"fra1tre":"Francois T.",
"mat1leg":"Mathias L.",
"fre1pot":"Fred P.",
"nan1fre":"Nancy F.",
"ala1gau":"Alain G.",
"ale1ber":"Alex B.",
"jea1leg":"J-F.",
"zie1gar":"Zied G.",
"A0H95400":"Mamadou E.",
"A0H95406":"Zaynab G."

}


const roles = {
   "M&P":["mat1for","A0H95406"],
   "CAD":["hug1del","A0h95459","pie1ger"],
   "CHARGÉ DE PROJETS":["A0H95322","jea1rat","abd1fak","jea1leg"],
   "CHARGE DE PROJETS":["A0H95322","jea1rat","abd1fak","jea1leg"],
   "METHODE":["fra1tre","mat1leg","fre1pot","nan1fre","A0H95400"],
   "METHODES":["fra1tre","mat1leg","fre1pot","nan1fre","A0H95400"],
   "MÉTHODES":["fra1tre","mat1leg","fre1pot","nan1fre","A0H95400"],
   "CAM":["ala1gau"],
   "PRODUCTION":["ale1ber","zie1gar"]
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
    var oBt = otable.querySelector('#AssignTo' + user)
    if (oBt === undefined || oBt === null) {
        var oTr = doc.createElement("tr");
        var oTd = doc.createElement("td");
        oBt = document.createElement('input');

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
}}


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


            tskTitle = elems[i].parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
            if (tskTitle !== undefined) {

                taskInfo = elems[i].value
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
    setTimeout(function() {
       assing_user_buttons()
      console.log('--------------------ca fast assign loaded -------------------');
   }, 1000);
