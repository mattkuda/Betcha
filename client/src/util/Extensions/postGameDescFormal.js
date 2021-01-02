export const postGameDescFormat = ( gameData) => {
  let rValue = new String();

  rValue = "FINAL: " + gameData.awayAbbreviation + " " + gameData.awayScore + " - " + gameData.homeAbbreviation + " " + gameData.homeScore;

  return rValue;
};