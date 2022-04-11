import React from "react";
import { getFetchInstance } from "./fetch-instance";

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


  getCompanyInfo = () => {
    const scope = "companyinfo/get";
    return getFetchInstance("API_URL", scope, false);
  };
}

const generalServices = new GeneralServices();
export default generalServices;
