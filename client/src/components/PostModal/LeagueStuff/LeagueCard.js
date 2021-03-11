import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import MyPopup from "../../../util/MyPopup";

function LeagueCard(props) {
  return (
    <Card fluid onClick={() => props.pickLeague(props.leagueName)} style={{margin: "20px"}}>
      <Card.Content style={{ display: "table", padding: "10px", verticalAlign: "middle", top: "50%"}}>
        <Image
          floated="left"
          size="mini"
          src={props.image}
          style={{ display: "table-cell", verticalAlign: "middle", textAlign: "left" }}
        />
        <Card.Header style={{ display: "table-cell", verticalAlign: "middle", textAlign: "left"}}>
          {props.displayName}
        </Card.Header>
      </Card.Content>
    </Card>
  );
}

export default LeagueCard;
