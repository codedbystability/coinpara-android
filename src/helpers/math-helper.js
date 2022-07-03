// import {formatMoney,formatNumber} from 'accounting'
import * as Accounting from "accounting";

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const finalFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 20,
});

export function unFormatMoney(num, fixed) {
  return Accounting.unformat(num, fixed);
}

export function formatMoney(num, fixed) {
  if (!num || parseFloat(num) <= 0) {
    return "0.00";
  } else if (num.toString().includes("e-")) {
    return num;
  }
  // if (num % 1 === 0) {
  //   return num.toFixed(fixed);
  // }

  const number = num.toString().match(new RegExp("^-?\\d+(?:\.\\d{0," + (fixed) + "})?"))[0];
  return Accounting.formatNumber(number, fixed, ".", ",");

  // const re = new RegExp("^-?\\d+(?:\.\\d{0," + (fixed || -1) + "})?");
  // const amount = parseFloat(num.toString().match(re)[0]);
  // return fractionAndFormat(finalFormatter.formatToParts(amount), fixed);
}


// export function formatMoney(number, decPlaces, decSep, thouSep) {
//   if (parseFloat(number) <= 0) {
//     return "0.0000";
//   }
//   decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
//     decSep = typeof decSep === "undefined" ? "." : decSep;
//   thouSep = typeof thouSep === "undefined" ? "," : thouSep;
//   const sign = number < 0 ? "-" : "";
//   const i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
//   let j;
//   j = (j = i.length) > 3 ? j % 3 : 0;
//
//   return sign +
//     (j ? i.substr(0, j) + thouSep : "") +
//     i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
//     (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
// }


const fractionAndFormat = (parts, digits) => {
  return parts.map(({ value }) => {
    // if (type !== "fraction" || !value || value.length < digits) {
    if (!value) {
      return value;
    }
    let retVal = "";
    for (let idx = 0, counter = 0; idx < value.length && counter < digits; idx++) {
      if (value[idx] !== "0" && value[idx] !== 0) {
        counter++;
      }
      // counter++;
      retVal += value[idx];
    }
    return retVal;
  }).reduce((string, part) => string + part);
};

export function formattedNumber(number, currency, precision) {
  if (number && number.toString().includes("e")) {
    return 0;
  }
  if (parseFloat(number) <= 0) {
    return "0,0000";
  }
  const frac = precision ? precision : ["TRY", "USD", "EUR", "GBP"].includes(currency) ? 4 : 8;
  return fractionAndFormat(finalFormatter.formatToParts(number), frac);
}

export function getDifferenceInSeconds(date1, date2) {
  return Math.abs(date2 - date1);
}

export function formatter() {
  return new Intl.NumberFormat("en-US", {
    style: "",
    currency: "USD",
  });
}


export function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + " " + item.symbol : "0";
}


export const normalizeInput = (value, previousValue) => {
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return currentValue;
    if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  }
};
