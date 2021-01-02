export const liveGameDescFormat = ( gameData) => {
  let rValue = new String();

  rValue = gameData.awayAbbreviation + " " + gameData.awayScore + " - " + gameData.homeAbbreviation + " " + gameData.homeScore + ", Q" + gameData.period + ": " + gameData.time;

  return rValue;
};


