export const betDescFormat = (betType, betAmount, gameData) => {
  console.log(betType);
  console.log(betAmount);
  console.log(gameData);
  console.log(gameData.homeAbbreviation);
  let rValue = new String();

  if (betType === "HOME") {
    rValue =
      gameData.homeAbbreviation +
      (betAmount >= 0 ? " +" : " ") +
      betAmount;
  } else if (betType === "AWAY") {
    rValue =
      gameData.awayAbbreviation +
      (betAmount >= 0 ? " +" : " ") +
      betAmount;
  } else if (betType === "UNDER") {
  } else if (betType === "OVER") {
  }

  return rValue;
};

export const betMatchFormat = (gameData) => {
 
  console.log(gameData);
  console.log(gameData.homeAbbreviation);
  let rValue = new String();

  rValue = gameData.awayAbbreviation + " @ " + gameData.homeAbbreviation;

  return rValue;
};
