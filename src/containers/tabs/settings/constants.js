import React from "react";

export const getStats = () => {
  return [
    {
      id: 4,
      key: "agreement",
      type: "navigation",
      page: "Static",
      name: "End User License Agreement",
      code: "ff3f0022-2840-45fc-940f-517991439eaf",
      content: "",
      url: "https://stackoverflow.com/questions/61832232/invariant-violation-requirenativecomponent-rncwebview-was-not-found-in-the-u",
    },
    {
      id: 5,
      key: "privacy",
      type: "navigation",
      page: "Static",
      name: "Privacy Policy",
      url: "https://stackoverflow.com/questions/61832232/invariant-violation-requirenativecomponent-rncwebview-was-not-found-in-the-u",
      code: "c496fa92-7206-4251-af44-b18fd11e216f",
      content: "",
    },
    {
      id: 6,
      key: "terms",
      type: "navigation",
      page: "Static",
      name: "Terms of Service",
      code: "199d9523-4cc2-48da-87c1-92cfeb3852d6",
      content: "",
      url: "https://stackoverflow.com/questions/61832232/invariant-violation-requirenativecomponent-rncwebview-was-not-found-in-the-u",
    },
    {
      id: 7,
      key: "about",
      type: "navigation",
      page: "Static",
      name: "About",
      code: "bda816f0-3031-4c6f-bc37-5615ea186080",
      content: "",
      url: "https://stackoverflow.com/questions/61832232/invariant-violation-requirenativecomponent-rncwebview-was-not-found-in-the-u",
    },
  ];
};
export const getItems = (activeTheme) => {
  return [
    // {
    //   id: 1,
    //   key: "ALARMS",
    //   type: "navigation",
    //   page: "Alarms",
    //   image: <AlarmSvg fill={activeTheme.appWhite} />,
    // },
    {
      id: 12,
      key: "TWO_FACTOR_AUTHENTICATION",
      type: "navigation",
      page: "TwoFactorAuthentication",
    },
    {
      id: 13,
      key: "TIME_EXPIRATION",
      type: "navigation",
      page: "TimeExpiration",
    },
    {
      id: 14,
      key: "USER_ACTIVITIES",
      type: "navigation",
      page: "UserLogs",
    },

    {
      id: 15,
      key: "CHANGE_PASSWORD",
      type: "navigation",
      page: "ChangePassword",
    },

    {
      id: 2,
      key: "LANGUAGE_SETTINGS",
      type: "language",
      page: null,
    },
    {
      id: 3,
      key: "CONTACT_SUPPORT",
      type: "modal",
      page: "Static",
      name: "Contact Support",
    },

  ];
};
