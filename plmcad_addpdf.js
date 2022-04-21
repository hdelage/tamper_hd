/*globals MY_LIB*/
// ==UserScript==
// @name         plmcad_addpdf
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow fast add pdf, reduce error because copy name to clipboard with widlcard.
// @updateURL    http://github.com/hdelage/tamper_hd/raw/main/plmcad_addpdf.js
// @downloadURL  http://github.com/hdelage/tamper_hd/raw/main/plmcad_addpdf.js
// @author       Hugo Delage
// @match        https://hut2019x.plm.marquez.ca:444/3dspace/components/emxComponentsCheckinDialog.jsp?*
// @icon         https://www.svgrepo.com/show/144578/pdf.svg
// @run-at       document-idle
// @grant    GM_setClipboard
// ==/UserScript==


/* globals jQuery, $, waitForKeyElements */

//https://hut2019x.plm.marquez.ca:444/3dspace/iefdesigncenter/DSCForm.jsp?SuiteDirectory=iefdesigncenter&treeLabel=0010-06103-0001-01&parentOID=22184.4057.10124.44040&formHeader=emxIEFDesignCenter.Common.Summary&emxSuiteDirectory=iefdesigncenter&HelpMarker=emxhelpdscproperties&portalMode=true&StringResourceFileId=emxIEFDesignCenterStringResource&mode=view&toolbar=DSCObjectSummaryToolBar&form=DSCObjectSummaryForm&portalCmdName=DSCObjectSummary&jsTreeID=null&suiteKey=DesignerCentral&header=emxIEFDesignCenter.ObjectPortal.Header&portal=DSCCADDrawingView&objectId=22184.4057.10124.44040

async function fetchAsync (url) {
  let response = await fetch(url);
  return response;
}

function name_to_clipboard(){
    var objectID = document.querySelector('input[name="objectId').value
    var fileType = '.' + document.querySelector('input[name="type"]').value
    var fileName = document.querySelector('input[name="fileName"]').value.replace(fileType,"*.pdf")

    //var urldwgproperties= 'https://hut2019x.plm.marquez.ca:444/3dspace/common/emxForm.jsp?form=type_CATDrawing&objectId=' + objectID
    GM_setClipboard (fileName);
}

// after launch and everything is loaded
setTimeout(function() {
    // set format = pdf per default
    name_to_clipboard()

    var selbox = document.querySelector('select[name="format"]')
    selbox.value = "PDF"
    var upload = document.querySelector('input[name="file"]')

    upload.click()
    if (upload.files.length === 1) {
        var filename = upload.files[0].name
        //check if unreleased
        if (filename.toLowerCase().include("unreleased")){
            alert("Attention Fichier est Unreleased")
        }
        //check if pdf
        if (filename.toLowerCase().include("pdf") === false){
            alert("Attention n'est pas pdf")
        }
    }
    //add_pdf_button()
    console.log('--------------------dwg fast pdf done -------------------');
}, 300);
