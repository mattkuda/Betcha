export const liveGameDescFormat = ( gameData) => {
  let rValue = new String();

  rValue = gameData.league === "mens-college-basketball" ? (
    gameData.awayAbbreviation + " " + gameData.awayScore + " - " + gameData.homeAbbreviation + " " + gameData.homeScore + ", H" + gameData.half + ": " + gameData.time
  ) : (
    gameData.awayAbbreviation + " " + gameData.awayScore + " - " + gameData.homeAbbreviation + " " + gameData.homeScore + ", Q" + gameData.period + ": " + gameData.time
  );


  return rValue;
};

export const reactionGameDescFormat = (awayAbbreviation, homeAbbreviation, specificData) => {
  let rValue = new String();

  rValue = specificData.half != null ? (
    awayAbbreviation + " " + specificData.awayScore + " - " + homeAbbreviation + " " + specificData.homeScore + ", H" + specificData.half + ": " + specificData.time
  ) : (
    awayAbbreviation + " " + specificData.awayScore + " - " + homeAbbreviation + " " + specificData.homeScore + ", Q" + specificData.period + ": " + specificData.time
  );


  return rValue;
}


