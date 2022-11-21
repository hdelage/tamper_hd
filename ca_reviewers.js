// ==UserScript==
// @name         Ca Reviewers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        */3dspace/common/emxCreate.jsp?form=type_CreateChangeActionSlidein*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marquez.ca
// @grant        none
// ==/UserScript==
// @run-at       document-idle
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
//https://hut2019x.plm.marquez.ca:444/3dspace/common/emxTree.jsp?isPopup=true&mode=tree&objectId=22184.4057.22256.57396&DefaultCategory=PMCSchedule

console.log('HD!!!-------------------- ca fast reviewer  ----------------');

const reviewers={"Vendor":{id:'22184.4057.60542.36402',descr:'VENDORS DWG APPROVAL ROUTE'},
"HAIC_2D3D":{id:'22184.4057.48331.20804',descr:'HC2D-3D APPROVAL ROUTE'},
"EDL":{id:'22184.4057.55247.25094',descr:'EDL APPROVAL ROUTE'},
"Tool":{id:'22184.4057.57933.12085',descr:'TOOLING APPROVAL ROUTE_EXCEPT TRIM JIG'},
"Trim-jig":{id:'22184.4057.59987.611',descr:'TRIM JIG APPROVAL ROUTE'},
"withEDRN":{id:'22184.4057.10286.35288',descr:'EDRN'},
}


function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(attr => {
    element.setAttribute(attr, attributes[attr]);
  });
}



function option_string(name){
    return '<option value="' + reviewers[name].id + '">' + reviewers[name].descr + '</option>'
}


function reviewer_assign(evt){
    var oBt = evt.currentTarget
    // set form modified flag to true
    document.querySelector('#IsContributorFieldModified').value='true'
    document.querySelector('#ReviewersHidden').value = oBt.id
    var s= document.querySelector('#Reviewers_html > table > tbody > tr:nth-child(1) > th > select')
    var o = s.querySelector('option')
    if (o === undefined || o === null) {o = document.createElement('option'); s.appendChild(o)} // create if not present
    o.value = oBt.id
    o.text = oBt.title
    //'<select name="Reviewers" style="width:200px" multiple="multiple"><option value="22184.4057.57933.12085">TOOLING APPROVAL ROUTE_EXCEPT TRIM JIG</option></select>'
    //s.outterHTML = '<select name="Reviewers" style="width:200px" multiple="multiple"><option value="' + oBt.id + '">' + oBt.description + '</option></select>'
    return false
}



function assign_button(){
   var div_reviewer = document.querySelector('#Reviewers_html')

   let tbl = document.querySelector('#HDReviewers')
   if (tbl === undefined || tbl === null) { // prevent add twice

       var tbd = document.createElement('tbody')

       //for (let i = 0; i < reviewers.length-2; i++) {}
       for (const [name, value] of Object.entries(reviewers)) {
           console.log(name, value);

           let rver = document.querySelector('#' + name)
           if (rver === undefined || rver === null) { // prevent add twice
               let tr = document.createElement('tr')
               let td = document.createElement('td')
               let bt = document.createElement('input')

               const attributes = {
                   id: value.id,
                   type: 'button',
                   value: name,
                   title: value.descr,
                   class: 'mx_btn-apply'}

               setAttributes(bt,attributes)
               bt.addEventListener ("click", reviewer_assign , false);
               td.appendChild(bt)
               tr.appendChild(td)
               tbd.appendChild(tr)
           };
       }


       // add elements to interface

       tbl = document.createElement('table')
       tbl.name = 'HDReviewers'
       tbl.id = 'HDReviewers'

       var tdx = document.createElement('td')
       tdx.setAttribute('rowspan','10')

       div_reviewer.querySelector('table >  tbody > tr').appendChild(tdx)
       tbl.appendChild(tbd)
       tdx.appendChild(tbl)

   }
}



// after launch and everything is loaded
    setTimeout(function() {
      assign_button()
      console.log('-------------------- ca fast reviewer loaded -------------------');
   }, 1000);