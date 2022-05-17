import React from "react";
import { getFetchInstance } from "./fetch-instance";


class OrderServices extends React.Component {

  search = (allUrl) => {
    return getFetchInstance(allUrl, "", true, true);
  };


}

const orderServices = new OrderServices();
export default orderServices;
