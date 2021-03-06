import React from "react";
import { Dimensions } from "react-native";
import { isIphoneX } from "../devices";

const { height, width } = Dimensions.get("window");

const isShort = height <= 600;
const isNarrow = width < 360;


let LIST_ITEM_HEIGHT,
  INPUT_HEIGHT,
  MODALIZE_INPUT,
  LABEL_HEIGHT,
  SQUARE_ITEM_HEIGHT,
  SQUARE_IMAGE,
  NORMAL_IMAGE,
  MIDDLE_IMAGE,
  BIG_IMAGE,
  BUTTON_PADDING,
  PADDING_V,
  PADDING_BV,
  MARGIN_T,
  PADDING_BIG,
  LIST_MARGIN_T,
  BIG_LIST_MARGIN_T,
  DRAW_VIEW,
  HEADER_TITLE_FONTSIZE,
  BIG_TITLE_FONTSIZE,
  TITLE_FONTSIZE,
  NORMAL_FONTSIZE,
  SUBTITLE_FONTSIZE,
  PADDING_BH,
  PADDING_H,
  SCREEN_HEIGHT = height,
  SCREEN_WIDTH = width,
  HEADER_HEIGHT = isIphoneX ? 70 : 40;


if (isNarrow) {
  HEADER_TITLE_FONTSIZE = 14;
  BIG_TITLE_FONTSIZE = 13;
  TITLE_FONTSIZE = 12;
  NORMAL_FONTSIZE = 11;
  SUBTITLE_FONTSIZE = 12;
  PADDING_BH = 12;
  PADDING_H = 6;
} else {
  HEADER_TITLE_FONTSIZE = 16;
  BIG_TITLE_FONTSIZE = 15;
  TITLE_FONTSIZE = 14;
  NORMAL_FONTSIZE = 13;
  SUBTITLE_FONTSIZE = 13;
  PADDING_BH = 16;
  PADDING_H = 12;
}

if (isShort) {
  LIST_ITEM_HEIGHT = 52;
  INPUT_HEIGHT = 46;
  MODALIZE_INPUT = 34;
  LABEL_HEIGHT = 30;
  SQUARE_ITEM_HEIGHT = 56;
  SQUARE_IMAGE = 20;
  NORMAL_IMAGE = 24;
  MIDDLE_IMAGE = 40;
  BIG_IMAGE = 80;
  BUTTON_PADDING = 4;
  PADDING_V = 8;
  PADDING_BV = 12;

  MARGIN_T = 14;
  PADDING_BIG = 30;
  LIST_MARGIN_T = 10;
  BIG_LIST_MARGIN_T = 14;
  DRAW_VIEW = 80;

} else {

  LIST_ITEM_HEIGHT = 64;
  INPUT_HEIGHT = 56;
  MODALIZE_INPUT = 44;
  LABEL_HEIGHT = 30;
  SQUARE_ITEM_HEIGHT = 64;
  SQUARE_IMAGE = 24;
  NORMAL_IMAGE = 26;
  MIDDLE_IMAGE = 60;
  BIG_IMAGE = 100;
  BUTTON_PADDING = 6;
  PADDING_V = 12;
  PADDING_BV = 16;
  MARGIN_T = 20;
  PADDING_BIG = 40;
  LIST_MARGIN_T = 12;
  BIG_LIST_MARGIN_T = 16;
  DRAW_VIEW = 100;
}

export const DIMENSIONS = {
  LIST_ITEM_HEIGHT,
  INPUT_HEIGHT,
  MODALIZE_INPUT,
  LABEL_HEIGHT,
  SQUARE_ITEM_HEIGHT,
  SQUARE_IMAGE,
  NORMAL_IMAGE,
  MIDDLE_IMAGE,
  BIG_IMAGE,
  BUTTON_PADDING,
  PADDING_V,
  PADDING_BV,
  MARGIN_T,
  PADDING_BIG,
  LIST_MARGIN_T,
  BIG_LIST_MARGIN_T,
  DRAW_VIEW,
  HEADER_TITLE_FONTSIZE,
  BIG_TITLE_FONTSIZE,
  TITLE_FONTSIZE,
  NORMAL_FONTSIZE,
  SUBTITLE_FONTSIZE,
  PADDING_BH,
  PADDING_H,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  HEADER_HEIGHT,
};

