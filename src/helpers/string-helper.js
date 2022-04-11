export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


export function hasWhiteSpace(s) {
  return /\s/g.test(s);
}


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const phoneInputRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;


export function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const handleIbanRegex = (iban) => iban.replace(/[^\dA-Z]/g, "").slice(0, 24).replace(/(.{4})/g, "$1 ").trim();
export const handleTcRegex = (iban) => iban.replace(/[^\dA-Z]/g, "").slice(0, 11).trim();


export function handleTcValid(tcno) {
  // geleni her zaman String'e çevirelim!
  tcno = String(tcno);

  // tcno '0' karakteri ile başlayamaz!
  if (tcno.substring(0, 1) === "0") {
    return false;
  }
  // Tcno 11 karakter uzunluğunda olmalı!
  if (tcno.length !== 11) {
    return false;
  }

  /**
   Aşağıdaki iki kontrol için toplamları hazır ediyoruz
   - o anki karakteri sayıya dönüştür
   - tek haneleri ayrıca topla (1,3,5,7,9)
   - çift haneleri ayrıca topla (2,4,6,8)
   - bütün haneleri ayrıca topla
   **/
  let hane_tek = 0;
  let hane_cift = 0;
  let ilkon_array = tcno.substr(0, 10).split("");
  let ilkon_total = 0;

  let j;
  for (let i = j = 0; i < 9; ++i) {
    j = parseInt(ilkon_array[i], 10);
    if (i & 1) { // tek ise, tcnin çift haneleri toplanmalı!
      hane_cift += j;
    } else {
      hane_tek += j;
    }
    ilkon_total += j;
  }

  /**
   KONTROL 1:
   1. 3. 5. 7. ve 9. hanelerin toplamının 7 katından,
   2. 4. 6. ve 8. hanelerin toplamı çıkartıldığında,
   elde edilen sonucun Mod10'u bize 10. haneyi verir
   **/
  if ((hane_tek * 7 - hane_cift) % 10 !== parseInt(tcno.substr(-2, 1), 10)) {
    return false;
  }

  /**
   KONTROL 2:
   1. 2. 3. 4. 5. 6. 7. 8. 9. ve 10. hanelerin toplamından
   elde edilen sonucun Mod10'u bize 11. haneyi vermelidir.
   NOT: ilk 9 haneyi üstteki FOR döndüsünde zaten topladık!
   **/
  ilkon_total += parseInt(ilkon_array[9], 10);
  if (ilkon_total % 10 !== parseInt(tcno.substr(-1), 10)) {
    return false;
  }

  return true;
}

// export function handleTcValid(value) {
//   value = value.toString();
//   const isEleven = /^[0-9]{11}$/.test(value);
//   let totalX = 0;
//   for (let i = 0; i < 10; i++) {
//     totalX += Number(value.substr(i, 1));
//   }
//   const isRuleX = totalX % 10 === value.substr(10, 1);
//   let totalY1 = 0;
//   let totalY2 = 0;
//   for (let i = 0; i < 10; i += 2) {
//     totalY1 += Number(value.substr(i, 1));
//   }
//   for (let i = 1; i < 10; i += 2) {
//     totalY2 += Number(value.substr(i, 1));
//   }
//   const isRuleY = ((totalY1 * 7) - totalY2) % 10 === value.substr(9, 0);
//   return isEleven && isRuleX && isRuleY;
// }
