import React from "react";
import { getFetchInstance, postFetchInstance } from "./fetch-instance";

const ENDPOINT = "alerts/";


class AlarmServices extends React.Component {

  createAlarm = (instance) => {
    const scope = "add";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };


  deleteAlarm = (instance) => {
    const scope = "delete";

    return postFetchInstance("API_URL", ENDPOINT + scope, instance);
  };

  getAlarms = () => {
    const scope = "list";

    return getFetchInstance("API_URL", ENDPOINT + scope);
  };


}

const alarmServices = new AlarmServices();
export default alarmServices;
