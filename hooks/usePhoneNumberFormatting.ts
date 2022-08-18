export default function usePhoneNumberFormatting(
  newPhoneNumber?: string,
  oldPhoneNumber?: string
) {
  if (newPhoneNumber) {
    const purePhoneNumber = newPhoneNumber.replace(/\D/g, "");
    const isBackspace = newPhoneNumber.length <= (oldPhoneNumber?.length ?? 0);

    /*
        if is backspace you have to reformat differently or else the pureNumber
        can technically stay the safe and it just readds the symbol you just deletePendingAnnouncement
        */
    if (isBackspace) {
      if (purePhoneNumber.length < 3) {
        //remove the parentheses
        return purePhoneNumber;
      } else {
        //keep parentheses
        return newPhoneNumber;
      }
    }

    if (purePhoneNumber.length < 3) {
      return purePhoneNumber;
    } else if (purePhoneNumber.length === 3) {
      return `(${purePhoneNumber}) `;
    } else if (purePhoneNumber.length < 6) {
      const phoneNumbersPortions = [
        purePhoneNumber.slice(0, 3),
        purePhoneNumber.slice(3, 7),
      ];

      return `(${phoneNumbersPortions[0]}) ${phoneNumbersPortions[1]}`;
    } else if (purePhoneNumber.length === 6) {
      const phoneNumbersPortions = [
        purePhoneNumber.slice(0, 3),
        purePhoneNumber.slice(3, 7),
      ];

      return `(${phoneNumbersPortions[0]}) ${phoneNumbersPortions[1]}-`;
    } else {
      const phoneNumbersPortions = [
        purePhoneNumber.slice(0, 3),
        purePhoneNumber.slice(3, 6),
        purePhoneNumber.slice(6, 10),
      ];

      return `(${phoneNumbersPortions[0]}) ${phoneNumbersPortions[1]}-${phoneNumbersPortions[2]}`;
    }
  } else {
    return "";
  }
}
