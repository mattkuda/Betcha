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

export const contextualizeBet = (betData) =>{
  console.log("we g8888888888888888888o inhere") 
  if (betData.betType === "HOME"){
    if (betData.betAmount > 0 ) betData.betAmount = "+" + betData.betAmount;
    return betData.gameId.homeAbbreviation + " " + betData.betAmount;
  }
  else if (betData.betType == "AWAY"){
    if (betData.betAmount > 0 ) betData.betAmount = "+" + betData.betAmount;
    return betData.gameId.awayAbbreviation + " " + betData.betAmount;
  }
  else if (betData.betType == "UNDER"){
    return "U " + betData.betAmount;
  }
  else return "O " + betData.betAmount;
}


