import React from 'react';
import BetIncrementer from './BetIncrementer';


function BetSelection(props) {

  return (
    <div>
      <BetIncrementer defValue={props.defValue} betValue={props.betValue} finalizeBet={props.chooseBetAmount}/>
    </div>
   
  )
}

export default BetSelection;
