import React from "react";

export const options = {
  title: "You can choose one image",
  includeBase64: true,
  quality: 1,
  maxWidth: 768,
  maxHeight: 768,
  storageOptions: {
    skipBackup: true,
  },
};
export const optionsVideo = {
  storageOptions: {
    skipBackup: true,
    path: "movies",
  },
  includeBase64: true,
  maxWidth: 512,
  maxHeight: 512,
  cameraType: "front",
  noData: true,
  mediaType: "video",
};
export const items = [
  {
    id: 1,
    approveField: "FirstApproval",
    isUploaded: "IdUploaded",
    noteField: "IdNote",
    defaultNote: "ID_APPROVE_DESC",
    key: "government-id",
    title: "GOVERNMENT_ID",
    desc: "",
    isApproved: false,
    isLoaded: false,
    icon: "identity",
  },
  {
    id: 2,
    approveField: "ThirdApproval",
    isUploaded: "SelfyUploaded",
    noteField: "SelfyNote",
    defaultNote: "SELFIE_APPROVE_DESC",
    key: "selfie-image",
    title: "SELFIE_WITH_SIGNATURE",
    isApproved: false,
    isLoaded: false,
    desc: "SelfyNote",
    icon: "selfie",

  },
  {
    id: 3,
    isUploaded: "AdressUploaded",
    isApproved: false,
    isLoaded: false,

    approveField: "SecondApproval",
    noteField: "AdressNote",
    defaultNote: "ADDRESS_APPROVE_DESC",
    key: "address-image",
    title: "ADDRESS_APPROVAL",
    desc: "AdressNote",
    icon: "address",

  },
  // {
  //   id: 4,
  //   isApproved: false,
  // isUploaded: "VideoSelfyUploaded",

//   approveField: "FourthApproval",
  //   defaultNote: "VIDEO_APPROVE_DESC",
  //   noteField: "VideoSelfyNote",
  // isLoaded: false,

//   key: "selfie-video",
  //   title: "VIDEO_SELFIE",
  //   desc: "VideoSelfyNote",
  //   icon: (color) => <VideoApproveSvg fill={color} />,
  //
  // },
];
