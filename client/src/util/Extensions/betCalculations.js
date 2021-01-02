export const determineBetResult = (
  homeScore,
  awayScore,
  betType,
  betAmount
) => {
  //OVER
  if (betType === "OVER") {
    if (parseFloat(homeScore) + parseFloat(awayScore) > parseFloat(betAmount)) {
      return "win";
    } else if (
      parseFloat(homeScore) + parseFloat(awayScore) ===
      parseFloat(betAmount)
    ) {
      return "push";
    } else return "loss";
  }
  //UNDER
  else if (betType === "UNDER") {
    if (parseFloat(homeScore) + parseFloat(awayScore) < parseFloat(betAmount)) {
      return "win";
    } else if (
      parseFloat(homeScore) + parseFloat(awayScore) ===
      parseFloat(betAmount)
    ) {
      return "push";
    } else return "loss";
  }
  //HOME SPREAD
  else if (betType === "HOME") {
    if (parseFloat(homeScore) + parseFloat(betAmount) > parseFloat(awayScore)) {
      return "win";
    } else if (
      parseFloat(homeScore) + parseFloat(betAmount) ===
      parseFloat(awayScore)
    ) {
      return "push";
    } else return "loss";
  }
  //AWAY SPREAD
  else {
    if (parseFloat(awayScore) + parseFloat(betAmount) > parseFloat(homeScore)) {
      return "win";
    } else if (
      parseFloat(awayScore) + parseFloat(betAmount) ===
      parseFloat(homeScore)
    ) {
      return "push";
    } else return "loss";
  }
};
