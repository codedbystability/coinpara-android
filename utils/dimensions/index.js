import React from "react";
import { Dimensions } from "react-native";
import { isIphoneX } from "../devices";


const { height, width } = Dimensions.get("window");

const isShort = height <= 600;
const isNarrow = width < 360;


export const SCREEN_HEIGHT = height;
export const SCREEN_WIDTH = width;
export const HEADER_HEIGHT = isIphoneX ? 70 : 40;

export const HEADER_TITLE_FONTSIZE = isNarrow ? 14 : 16;
export const TITLE_FONTSIZE = isNarrow ? 12 : 14;
export const BIG_TITLE_FONTSIZE = isNarrow ? 13 : 15;
export const NORMAL_FONTSIZE = isNarrow ? 11 : 13;
export const SUBTITLE_FONTSIZE = isNarrow ? 12 : 13;


export const LIST_ITEM_HEIGHT = isShort ? 52 : 64;
export const INPUT_HEIGHT = isShort ? 50 : 60;
export const MODALIZE_INPUT = isShort ? 34 : 44;
export const LABEL_HEIGHT = isShort ? 30 : 30;
export const SQUARE_ITEM_HEIGHT = isShort ? 56 : 64;
export const SQUARE_IMAGE = isShort ? 20 : 24;
export const NORMAL_IMAGE = isShort ? 24 : 26;
export const MIDDLE_IMAGE = isShort ? 40 : 60;
export const BIG_IMAGE = isShort ? 80 : 100;
export const BUTTON_PADDING = isShort ? 4 : 6;
export const INFO_CARD_HEIGHT = isShort ? 70 : 90;
export const PADDING_V = isShort ? 8 : 12;
export const PADDING_BV = isShort ? 12 : 16;
export const PADDING_BH = isNarrow ? 12 : 16;
export const PADDING_H = isNarrow ? 6 : 12;
export const MARGIN_T = isShort ? 14 : 20;
export const GRADIENT_H = isShort ? 100 : 120;
export const PADDING_BIG = isShort ? 30 : 40;
export const LIST_MARGIN_T = isShort ? 10 : 12;
export const BIG_LIST_MARGIN_T = isShort ? 14 : 16;
export const TAB_BAR_M = isShort ? 2 : 5;
export const ICON_SIZE = isShort ? 20 : 22;
export const MODALIZE_DIFF = isShort ? 120 : 160;
export const DRAW_VIEW = isShort ? 80 : 100;



