export const betDescFormat = (betType, betAmount, gameData) => {
  let rValue = new String();

  if (betType === "HOME") {
    rValue =
      gameData.homeAbbreviation +
      (betAmount == 0
        ? " Moneyline"
        : betAmount > 0
        ? " +" + betAmount
        : " " + betAmount);
  } else if (betType === "AWAY") {
    rValue =
      gameData.awayAbbreviation +
      (betAmount == 0
        ? " Moneyline"
        : betAmount > 0
        ? " +" + betAmount
        : " " + betAmount);
  } else if (betType === "UNDER") {
    rValue = "Under " + betAmount;
  } else if (betType === "OVER") {
    rValue = "Over " + betAmount;
  }

  return rValue;
};

export const betMatchFormat = (gameData) => {
  let rValue = new String();

  rValue = gameData.awayAbbreviation + " @ " + gameData.homeAbbreviation;

  return rValue;
};
