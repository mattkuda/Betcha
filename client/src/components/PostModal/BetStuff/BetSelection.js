import React from "react";
import BetIncrementer from "./BetIncrementer";

function BetSelection(props) {
  return (
    <div style={{display: "inline-block"}}>
      <BetIncrementer
        defValue={props.betValue}
        betValue={props.betValue}
        finalizeBet={props.chooseBetAmount}
        editAmount={props.chooseEditAmount}
        editOdds={props.chooseEditOdds}
      />
    </div>
  );
}

export default BetSelection;
