import React from "react";
import { getFetchInstance } from "./fetch-instance";

class ConstantServices extends React.Component {

  getLanguages = (show = true) => {
    const scope = "languages/get";
    return getFetchInstance("API_URL", scope, show);
  };

  getVideos = (langId, show = true) => {
    const scope = "video/list?RowLimit=15&PageNumber=1&OrderBy=&DateFrom&DateTo&PublisherId&Title&Source&Category&Tag&Location&LangId=" + langId;
    return getFetchInstance("API_URL", scope, show);
  };


  getLanguageContent = (languageId, show) => {

    if (!languageId) {
      return null;
    }
    const scope = "Content/GetAllContentMapped/ " + languageId;
    return getFetchInstance("API_URL", scope, show);
  };


}

const constantServices = new ConstantServices();
export default constantServices;
