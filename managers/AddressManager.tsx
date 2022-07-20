/* -------------------------------------------------------------------------- */
/*                            Address Type Checker                            */
/* -------------------------------------------------------------------------- */

export const addressContainsTitle = (unformattedAddress: string) => {
  var addressArray = unformattedAddress.split(",");
  const firstElem = addressArray[0].split(" ")[0];
  const isNum = /^\d+$/.test(firstElem);

  return !isNum;
};

/* -------------------------------------------------------------------------- */
/*                             Address Formatting                             */
/* -------------------------------------------------------------------------- */

/* ---------------------------- Google Formatting --------------------------- */

export const getGoogleFormattedAddress = (unformattedAddress: string) => {
  var addressArray = unformattedAddress.split(",");
  addressArray.shift();
  const formattedAddress = addressArray.join(",");
  return formattedAddress;
};

/* ---------------------------- Human Formatting ---------------------------- */

export const getHumanFormattedAddress = (unformattedAddress: string) => {
  const addressArray = unformattedAddress.split("/");
  const address = addressArray[addressArray.length - 3].split("+").join(" ");
  return address;
};

export const getShortenedAddress = (unformattedAddress: string) => {
  const addressArray = unformattedAddress.split(",");
  if (addressContainsTitle(unformattedAddress)) {
    return addressArray[0];
  } else {
    return addressArray[0] + "," + addressArray[1];
  }
};
