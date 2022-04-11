import React from "react";

export const percentages = [
  { id: 1, value: "25" },
  { id: 2, value: "50" },
  { id: 3, value: "75" },
  { id: 4, value: "100" },
];
export const stopInputs = [
  {
    id: 1,
    leftLabel: "STOP_LIMIT",
    icon: "refresh-ccw",
    rightLabel: "fs",
    arrows: true,
    key: "stop-price",
    ref: React.createRef(),
  },
  {
    id: 2,
    leftLabel: "PRICE",
    icon: "refresh-ccw",
    rightLabel: "fs",
    arrows: true,
    key: "price",
    ref: React.createRef(),
  },
  {
    id: 3, leftLabel: "AMOUNT", icon: null, rightLabel: "to", arrows: true, key: "amount", ref: React.createRef(),
  },
  {
    id: 4,
    disabled: true,
    leftLabel: "TOTAL", icon: null, rightLabel: "fs", arrows: false, key: "total", ref: React.createRef(),
  },
];
export const limitInputs = [
  {
    id: 2,
    leftLabel: "PRICE",
    icon: "refresh-ccw",
    rightLabel: "fs",
    arrows: true,
    key: "price",
    ref: React.createRef(),
  },
  {
    id: 3, leftLabel: "AMOUNT", icon: null, rightLabel: "to", arrows: true, key: "amount", ref: React.createRef(),
  },
  {
    id: 4, leftLabel: "TOTAL", icon: null,
    disabled: false,
    rightLabel: "fs", arrows: false, key: "total", ref: React.createRef(),
  },
];
export const marketAmountInputs = [
  {
    id: 2,
    leftLabel: "AMOUNT",
    // icon: "refresh-ccw",
    icon: null,
    rightLabel: "to",
    arrows: true,
    key: "amount",
    ref: React.createRef(),
  },

];

export const marketTotalInputs = [
  {
    id: 2,
    leftLabel: "TOTAL",
    // icon: "refresh-ccw",
    icon: null,
    rightLabel: "fs",
    arrows: true,
    key: "total",
    ref: React.createRef(),
  },

];
