import React from 'react';
import BetIncrementer from './BetIncrementer';


function BetSelection(props) {
  return (
    <div>
      <BetIncrementer defValue = {props.defValue}/>
    </div>
  )
}

export default BetSelection;
