https://stackoverflow.com/questions/15730216/how-where-to-store-data-in-a-chrome-tampermonkey-script-other-than-localstorage

// 1. Create a date/timesheet log, if not present in current week, open page and get it, if not present ask user to create it...
// 2. store id in GM_value

// 3. add button --> send request to add to timesheet
// 4. log time, --> ask time, and set as value for today on the current timesheet / effort? 


https://hut2019x.plm.marquez.ca:444/3dspace/common/emxPortalDisplay.jsp?portal=PMCWeeklyTimeSheet&header=emxProgramCentral.WeeklyTimesheet.WeeklyTimeSheet&HelpMarker=emxhelptimesheetlist&suiteKey=ProgramCentral&StringResourceFileId=emxProgramCentralStringResource&SuiteDirectory=programcentral

--> SELECTION SEMAINE --> AFFICHE EN BAS
GET TIMESHEETS:
https://hut2019x.plm.marquez.ca:444/3dspace/common/emxFreezePaneGetData.jsp?
	fpTimeStamp=1643040326139
	&objectId=
	&firstTime=true
	&toolbarData=
	&IsStructureCompare=FALSE

RETOURNE xml-> rows / r item comme ceci... id timesheet = 22184.4057.14016.30690
<mxRoot><rows totalRows="1"><r ra="t" o="22184.4057.14016.30690" r="22184.4057.64437.54148" p="" id="0,0" type="Weekly Timesheet" i="images/iconColHeadTime.gif" rel="Weekly Timesheet" level="0" filter="false" t="1649700343759" d=""><c a="15">15</c><c a="&lt;a target='listHidden' href=&quot;../programcentral/emxProgramCentralWeeklyTimesheetUtil.jsp?mode=displayTimesheetTasks&amp;amp;objectId=22184.4057.14016.30690&quot;&gt;Apr 11-22 - Apr 17-22&lt;/a&gt;" i="images/iconColHeadTime.gif"><a target="listHidden" href="../programcentral/emxProgramCentralWeeklyTimesheetUtil.jsp?mode=displayTimesheetTasks&amp;objectId=22184.4057.14016.30690">Apr 11-22 - Apr 17-22</a></c><c a="" /><c date="4/17/2022 12:00:00 AM" msValue="1650214800000" a="4/17/2022 12:00:00 AM">17-Apr-2022</c><c a="Create">Create</c><c a="4.0">4.0</c></r></rows>

--> lien quand clic= https://hut2019x.plm.marquez.ca:444/3dspace/programcentral/emxProgramCentralWeeklyTimesheetUtil.jsp?mode=displayTimesheetTasks&objectId=22184.4057.14016.30690


--> lien pour ajouter= 
value item selectionné "|22184.4057.389.51990|22184.4057.14016.30690|0,229"
https://hut2019x.plm.marquez.ca:444/3dspace/common/emxIndentedTable.jsp?table=PMCTimeSheetSearchAddTask&selection=multiple&header=emxProgramCentral.Common.Search&program=emxWeeklyTimeSheet:getAssignedTasks&hideHeader=true&suiteKey=ProgramCentral&cancelLabel=emxProgramCentral.Common.Close&relationship=relationship_Subtask&direction=from&submitURL=../programcentral/emxProgramCentralWeeklyTimesheetUtil.jsp?mode=addTask&Export=false&showClipboard=false&showPageURLIcon=false&triggerValidation=false&massPromoteDemote=false&displayView=details&suiteKey=ProgramCentral&StringResourceFileId=emxProgramCentralStringResource&mode=PMCWeeklyTimesheetAddTask&suiteKey=ProgramCentral&StringResourceFileId=emxProgramCentralStringResource&SuiteDirectory=programcentral&objectId=22184.4057.14016.30690&parentOID=22184.4057.14016.30690&widgetId=null&csrfTokenName=ENO_CSRF_TOKEN&ENO_CSRF_TOKEN=2JW7-1I3P-WU8Z-BAV1-MEXR-RM8R-K5DD-R8DI&targetLocation=popup


Save to task:



url:
https://hut2019x.plm.marquez.ca:444/3dspace/common/emxFreezePaneProcessXML.jsp

parameters:
timeStamp=1643040326092&strSortColumnNames=
&toolbarData=PMCDatePickerCommand=|PMCDatePickerCommand_msvalue=


payload:
