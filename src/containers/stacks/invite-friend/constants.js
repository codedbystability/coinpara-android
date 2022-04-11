import { Platform } from "react-native";

export const title = "CoinPara";
export const message = "";
export const options = (data) => {
  return Platform.select({
    ios: {
      activityItemSources: [
        {
          // For sharing url with custom title.
          placeholderItem: { type: "url", content: data },
          item: {
            default: { type: "url", content: data },
          },
          subject: {
            default: title,
          },
          linkMetadata: { originalUrl: data, data, title },
        },
        {
          // For sharing text.
          placeholderItem: { type: "text", content: data },
          item: {
            default: { type: "text", content: data },
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: {
            // For showing app icon on share preview.
            title: data,
          },
        },
      ],
    },
    android: {
      title: title,
      message: message,
      url: data,
    },
    default: {
      title,
      subject: title,
      message: `${message} ${data}`,
    },
  });
};


export const headers = [
  { id: 1, key: "invite", title: "INVITE" },
  { id: 2, key: "generate", title: "GENERATE_LINK" },
];
export const percentages = [
  { id: 1, value: "0" },
  { id: 2, value: "5" },
  { id: 3, value: "10" },
  { id: 4, value: "20" },
];
