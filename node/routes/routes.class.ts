'use strict';
import { AppRoute } from "../lib/AppRoute";
import { UserClass } from "../include/user.class";
import { Campaign } from "../include/campaign.class";
import { Executive } from "../include/executive.class";
import { Credit } from "../include/credit.class";
import { API } from "../include/api.class";
import { SettingClass } from "../include/setting.class";
import {Did } from "../include/did.class";
import { team_member } from "../include/team-member.class";
import { Client } from "../include/client-team.class";
import { Task } from "../include/task.class";
import { cases } from "../include/case.class";


var multer = require('multer');
var upload = multer({ dest: process.cwd() + "/uploads/" });
export const type = upload.single('filename');


module.exports = function (app: any) {






  // Executive class and method
  const ca = new cases();
  app.post('/saveCase', ca.saveCase);
  app.post("/ccc", ca.getMemberById)
  app.post("/ccccc", ca.updateMember)

  // Executive class and method
  const team = new team_member();
  app.post('/saveMember', team.saveMember);
  app.post('/addexuctiveuserdata', team.executiveMapping);
  app.post("/getMemberbyid", team.getMemberById)
  app.post("/updateMember", team.updateMember)

  // app.get('/getcrmdata', team.updateMember);



  const client = new Client();
  app.post("/saveClient", client.saveClient);
  app.post("/editData", client.editData);
  app.post("/editDataShipment", client.editDataShipment); 
  app.post("/editDataVendor", client.editDataVendor);
  app.post("/updateVendorData", client.updateVendorData);
  app.post("/getShipemntdata", client.getShipemntdata);
  app.post("/updateShipment", client.updateShipment);
  app.post("/editClient", client.editClient)
  app.post("/saveSearch", client.saveSearch)

  const task = new Task();
  app.post("/editDatda", task.editData)
  app.post("/editTask", task.editTask)
  
  
  
  // Setting class and method
  const setting = new SettingClass();
  app.post("/editcashstatus", setting.editData)
  app.post("/updatecashstatus", setting.updatecashstatus)
  app.post("/updateStatus", setting.updateStatus)
  app.post("/updateCourt",setting.updateCourt)
  app.post("/updatejudge",setting.updatejudge)

  //API Class ans Method
  const api = new API();
  app.get("/campaign", api.getCampaignData);
  app.get('/contact', api.ContactList);
  app.get('/block', api.Blocklist);
  app.get('/voice', api.VoiceList);
  app.post('/apilogin', api.userLogin);
  app.post('/contact', type, api.uploadContact);
  app.post('/block', type, api.uploadBlockList);
  app.post('/voice', type, api.uploadVoiceFile)
  app.post('/start', api.startCampaign);
  app.post('/stop', api.stopCampaign);
  app.post('/campaign', api.createCapmaign);
  app.post('/createCapmaignNumber', api.createCapmaignNumber);
  app.delete('/contact', api.deteteContact);
  app.delete('/block', api.deteteBlock);
  app.get('/campaignData', api.getCampaignlist);
  app.delete('/voice', api.DeletevoiceFile);
  app.post('/campaign_tts', api.addttsCampaign);
  app.post('/campaigns', api.Campaigns);



// for user class
  const userp = new UserClass();
  app.put("/change_password", userp.changePassword)
  app.put("/update_profile", userp.updateProfile)
  app.get("/getpackagesdata", userp.getpackagesdata)
  app.post("/updatepayment", userp.updatepayment)
  app.post("/forgotpassword", userp.resetpassword);
  app.post("/confirmationotp", userp.confirmotp)
  app.put("/updatepassword", userp.update_password)
  app.post("/updatepasswordpro", userp.profilepassupdate)
  app.post("/imgupload", type, userp.imgupload); // upload profile image
  app.post("/loginuser", userp.userLogin)
  app.get('/getprofile', userp.getProfileData);
  app.put('/addImage', type, userp.updateUserProfile)
  app.post('/logout', userp.userLogout)
  app.post("/saveuserdata", userp.adduserdata);
  app.get('/getaccountdata', userp.getallaccount);
  app.post('/datadelete', userp.deletedata);
  app.post('/getauthkey', userp.authkey);
  app.get('/getsingleuser', userp.getSingleUser);
  app.put('/updateuser', userp.updateusers);
  app.post('/isactive', userp.isActive);
  app.post("/companyDoc", type, userp.companyDoc); // upload profile image
  app.post("/deleteCompanyUpload", userp.deleteCompanyUpload);
    // app.get('/masterUser', userp.masterUser);
  const did = new Did();
  app.get('/getaccountdata', did.getallaccount);
  app.post('/assigneddiddata', did.didassigneddata)
  app.get('/getdiddatabyids', did.getdiddatabyfilter)
  app.get('/unassigneddid', did.unassigneddiddata)

  // Campaign class and method
  const campaign = new Campaign()
  app.post("/savecampaign", type, campaign.saveCampaign);
  app.post("/saveTestCampaign", type, campaign.saveTestCampaign);
  app.post("/saveSubmitCampaign", type, campaign.saveSubmitCampaign);
  app.post("/testCamp", type, campaign.testCamp);
  app.post("/checkTestCamp", campaign.checkTestCamp)
  app.get("/getcampaign", campaign.getCampaign);
  
  app.post('/uploadcontact', type, campaign.uploadcontactFile)
  app.post('/particulerUploadcontact', type, campaign.particulerUploadcontactFile)
  app.put('/updateDIDService', campaign.updateDIDService);
  app.post('/uploadDtmf', type, campaign.uploadDtmfFile)
  app.post('/audioupload', type, campaign.uploadVoiceFiles)
  app.post('/uploadblacklist', type, campaign.uploadblackFiles)
  app.get('/getUploadContact', campaign.getUploadContact)
  app.get('/getUploadVoice', campaign.getUploadVoice)
  app.get('/getUploadDtmf', campaign.getUploadDtmf)
  app.get('/getUploadBlock', campaign.getUploadBlock)
  app.delete('/deletecontact', campaign.deletecontact)
  app.put('/updatecampaign', campaign.updateCampaign);
  app.delete('/deletecampaign', campaign.deleteCampaign);
  app.post('/changestatus', campaign.changestatus);
  app.get('/gettotalcontact', campaign.getTotalContactNo);
  app.get('/getsetcampid', campaign.getCamapignID);
  app.get('/getsoundfiles', campaign.getsoundfiles);
  app.get('/widgetreports', campaign.widgetReport);
  app.get('/graphreports', campaign.graphReport);
  app.get('/missCallSummaryReport', campaign.missCallSummaryReport);
  app.get('/dtmfSummeryReport', campaign.getDatadtmfSummery);
  app.get('/getForSMSData', campaign.getForSMSData);
  app.get('/getFilterForMisscallSummary', campaign.getFilterForMisscallSummary);
  app.get('/getFilterForMisscallSummarySms', campaign.getFilterForMisscallSummarySms);
  app.get('/dtmfSummeryDeatiles', campaign.getDatadtmfDetailes);
  app.get('/getAllOnlyVoiceDetails', campaign.getAllOnlyVoiceDetails);
  app.get('/getVoiceTransferDeatiles', campaign.getVoiceTransferDeatiles);
  app.get('/getForAllonlyVoiceTransfer', campaign.getForAllonlyVoiceTransfer);
  app.get('/getVoiceTransferSummary', campaign.getVoiceTransferSummary)
  app.get('/getForAllonlyVoicesummary', campaign.getForAllonlyVoicesummary)
  app.get('/smsSummeryreport', campaign.getSMSsummery);
  app.get('/forTTSReportSMS', campaign.forTTSReportSms);
  app.get('/forTTSReportCalls', campaign.forTTSReportCalls);
  app.get('/forCountMisscalls', campaign.forCountMisscalls);
  app.get('/forCountSMS', campaign.forCountSMS);
  app.get('/forDeatilesTTSRep', campaign.forDeatilesTTSRep);
  app.get('/forSummaryTTSRep', campaign.forSummaryTTSRep);
  app.get("/getDtmfUser", campaign.getDtmfUser);
  app.post("/getAllDTMFCamp", campaign.getAllDTMFCamp);
  app.post("/getDtmfNoDetailes", campaign.getDtmfNoDetailes)
  app.post("/ttsAPI", campaign.ttsAPI);
  app.get('/smsDetailreport', campaign.getSMSdetailed);
  app.get('/todayCreditUsed', campaign.todayCreditUsed);
  // app.get('/coastValue', campaign.campaigncastcalue)

  //for export
  app.get('/getToExportAllDTMF',campaign.getToExportAllDTMF)
  app.get('/getToAllExportDetailes',campaign.getToAllExportDetailes)
  app.get('/getAllNoDetailes', campaign.getAllNoDetailes)
  app.get('/getForAllonlyVoice', campaign.getForAllonlyVoice)
  app.get('/forAllDeatilesTTS', campaign.forAllDeatilesTTS)
  app.get('/getForALLSMSData', campaign.getForALLSMSData)
  app.get('/getForALLsummeryRepot', campaign.getForALLsummeryRepot)
  app.get('/getForAllTTSReportSMS', campaign.getForAllTTSReportSMS)
  app.get('/getForALlTTSReportCalls', campaign.getForALlTTSReportCalls)
  app.get('/getFillterALlTTSRepo', campaign.getFillterALlTTSRepo)
  app.get('/getForAllMisscalls', campaign.getForAllMisscalls)
  app.get('/getForALLSMSDataValuesss', campaign.getForALLSMSDataValuesss)
  app.get('/allget', campaign.allget);
  app.get('/allget2', campaign.allget2);








  // Executive class and method
  const execute = new Executive();
  app.post('/saveexecutive', execute.saveexcutive);
  app.get('/getcrmdata', execute.getCrmData);
  app.post('/uploadsounds', type, execute.uploadSound);
  app.get('/getfiletypedata', execute.getfiletyprdata);
  app.get('/getfiletypedata2', execute.getfiletyprdata2);
  app.get('/exuctivedatacomponent', execute.getfilterexuctive)
  app.post('/getDatawithDate', execute.getDatawithDate)
  app.post('/getDatawithCompaign', execute.getDatawithCompaign)
  app.post('/getDatawithAgentss', execute.getDatawithAgentss)
  app.post('/getDatawithCallduration', execute.getDatawithCallduration)
  app.post('/persetdefaultdata', execute.setperdefault)
  app.post('/setdefaultdata', execute.setsounddefault)
  app.delete('/deletesound', execute.deleteSound);
  app.delete('/deletesoundfile', execute.deleteSoundFileData);
  app.put('/updatesound', execute.updateSound);
  app.put('/updateSet', execute.updateSet);
  app.put('/holdupdate', execute.holdupdate);
  app.put('/busyset', execute.busyset);
  app.put('/voicemailset', execute.voicemailset);
  app.put('/updatecallhistory', execute.updatecallhistory);
  app.get('/blocklistdata', execute.getBlockListData);
  app.get('/getblockitem', execute.getBlockItem);
  app.put('/changeagentstatus', execute.changeAgentStatus);
  app.put('/unblockstatus', execute.unblockStatus);
  app.post('/blockagent', execute.blockAgent);
  app.post('/unblockhistory', execute.unBlockHistory);
  app.put('/updatecrm', execute.updatecrm);
  app.put('/changeagentstatuscrm', execute.changeAgentStatusCRM);
  app.post('/moveincrmdata', execute.movecrmData);
  app.delete('/deletecallhistoryitem', execute.deleteCallHistoryItem);
  app.delete('/deleteblocklistitem', execute.deleteBlockListItem);
  app.post('/groups', execute.createGroup);
  app.delete('/deletegroup', execute.deleteExeGroup);
  app.post('/addexuctiveuserdata', execute.executiveMapping);
  app.post('/getExective', execute.getExective);
  app.post('/updateWithStatus', execute.updateWithStatus);
  app.delete('/deleteExecutive', execute.deleteExecutive);
  app.delete('/mapSMS', execute.deleteSMS);
  app.get('/getParticulerExcData',execute.getParticulerExcData)



  // Credit class and method
  const credit = new Credit();
  app.post('/creditrequest', credit.creditRequest);
  app.get('/getForDataPassbook', credit.getcampaignpassbook)
  app.post('/getDatefitercampaignpassbook', credit.getDatefitercampaignpassbook)
  app.post('/getDatefiterUsername', credit.getDatefiterUsername)


  

  


  var obj = new AppRoute();
  app.get("/[a-z]{1,20}", obj.getMethod);
  app.post("/[a-z]{1,20}", obj.postMethod);
  app.put("/[a-z]{1,20}", obj.putMethod);
  app.delete("/[a-z]{1,20}", obj.deleteMethod);
  app.patch("/[a-z]{1,20}", obj.patchMethod);




}
