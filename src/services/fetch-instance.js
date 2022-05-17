import Loading from "../providers/Loading";
import axios from "axios";
import DropdownAlert from "../providers/DropdownAlert";
import LocalStorage from "../providers/LocalStorage";

export const postFetchInstance = async (urlKEY, endpoint, instance, loading = true, isToken = true) => {
  const URL = "https://apiv2.coinpara.com/api/";

  if (loading) {
    Loading.show();
  }

  const token = LocalStorage.getItem("token");

  return new Promise((resolve, reject) => {
    return axios.post(URL + endpoint, instance, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": isToken ? "Bearer " + token : "",
      },
      timeout: 15000,
    })
      .then((response) => {
        if (loading) {
          Loading.hide();
        }
        if (loading && (!response || !response.data || !response.data.IsSuccess) && response.data.ErrorMessage) {
          DropdownAlert.show("error", "-", response.data.ErrorMessage);
        }
        return resolve(response.data);
      }).catch(error => {
        if (loading) {
          Loading.hide();
        }
        const errorRes = handleHttpError(error, URL + endpoint);
        return resolve(errorRes);

      });


  });
};


export const getFetchInstance = async (urlKEY, endpoint, loading = true, direct = false) => {

  const URL = direct ? urlKEY : "https://apiv2.coinpara.com/api/" + endpoint;

  if (loading) {
    Loading.show();
  }

  const token = LocalStorage.getItem("token");
  return new Promise((resolve, reject) => {

    axios.get(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      timeout: 15000,
    })
      .then((response) => {
          if (loading) {
            Loading.hide();
          }
          if (loading && !response.data.IsSuccess && response.data.ErrorMessage) {
            DropdownAlert.show("error", "...", response.data.ErrorMessage);
          }
          return resolve(response.data);
        },
      ).catch(error => {
      if (loading) {
        Loading.hide();
      }
      handleHttpError(error, URL);
      return resolve(null);

    });
  });


};

export const getFetchInstance3 = async (urlKEY, endpoint, loading = false, params = {}) => {
  const URL = "https://apiv2.coinpara.com/api/";

  const config = {
    method: "post",
    url: URL + endpoint,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(params),
  };

  return new Promise((resolve, reject) => {
    axios(config).then((response) => {
        return resolve(response.data);
      },
    ).catch(error => {
      handleHttpError(error, URL + endpoint);
      return resolve(null);

    });

  });
};

const handleHttpError = (error, URL) => {
  console.log("******************handleHttpError-handleHttpError-handleHttpError-handleHttpError-handleHttpError**************** - ", "error.message - ", error.message, " - ", URL);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.status);
  } else if (error.request) {
    console.log("The request was made but no response was received", error.request);
  } else {
    console.log("Something happened in setting up the request that triggered an Error", error.message);
  }

  return null;
};

export const apiPostWithTokenAndImage = async (url, param) => {
  const token = LocalStorage.getItem("token");
  let headers = {
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + token,
    Accept: "application/json",
  };
  let obj = {
    method: "POST",
    headers: headers,
    body: param,
  };
  return fetch(url, obj)// put your API URL here
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    }).catch(error => {
      const errorRes = handleHttpError(error, url);
      return errorRes;

    });
};
