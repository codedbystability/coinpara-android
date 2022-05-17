import React from "react";
import { getFetchInstance, postFetchInstance } from "./fetch-instance";

class GeneralServices extends React.Component {

  getColors = (code = "dark", show = true) => {
    const scope = "theme/data?mobile=true&name=";
    return getFetchInstance("API_URL", scope + "theme-" + code, show);
  };

  getStaticContents = (langId) => {
    const scope = "Content/GetAllContent/";
    return getFetchInstance("API_URL", scope + langId, false);
  };


  getLanguageContent = (lang = "en-US", show = true) => {
    return getFetchInstance("API_URL", "languages/data?mobile=true&name=" + lang, show, false);
  };


  // getMobileInfo = (show = false) => {
  //   return getFetchInstance("API_URL", "https://w-validator.coinpara.com/api/mobile/info", show, true);
  // };


  getSliders = (langId, show = false) => {
    const scope = "Banner/GetAllBanner/";
    return getFetchInstance("API_URL", scope + langId + "/1?IsMobile=true", show);
  };


  getHelpCenterContent = (langId, show = false) => {
    const scope = "InfoBank/GetAllInfoBank/" + langId;
    return getFetchInstance("API_URL", scope, show);
  };

  getCompanyInfo = () => {
    const scope = "companyinfo/get";
    return getFetchInstance("API_URL", scope, false);
  };

  // https://apiv2.coinpara.com/api/HelpDesk/GetAllHelpCategory/1

  getSupportCategories = (langId) => {
    const scope = "HelpDesk/GetAllHelpCategory/" + langId;
    return getFetchInstance("API_URL", scope, false);
  };


  getSupportDepartments = (langId) => {
    const scope = "HelpDesk/GetAllDepartments/" + langId;
    return getFetchInstance("API_URL", scope, false);
  };


  getSupportPriorities = (langId) => {
    const scope = "HelpDesk/GetAllHelpPriorities/" + langId;
    return getFetchInstance("API_URL", scope, false);
  };


  getOpenSupportRequests(statusId) {
    const scope = "HelpDesk/supportlist?RowLimit=16&PageNumber=1&FirstName=&LastName=&Status=" + statusId;
    return getFetchInstance("API_URL", scope, false);
  }

  createHelpRequest(instance) {
    const scope = "HelpDesk/Insert";
    return postFetchInstance("API_URL", scope, instance, true);
  }

  getHelpDetails(gd) {
    const scope = "HelpDesk/reply/list?RowLimit=60&PageNumber=1&OrderBy=TimeStamp+ASC&HelpDeskId=" + gd;
    return getFetchInstance("API_URL", scope, true);
  }

  storeAttachments(instance) {
    const scope = "HelpDesk/attachments";
    return postFetchInstance("API_URL", scope, instance, false);
  }

  insertHelp(instance) {
    const scope = "HelpDesk/InsertDetail";
    return postFetchInstance("API_URL", scope, instance, true);
  }


}

const generalServices = new GeneralServices();
export default generalServices;
