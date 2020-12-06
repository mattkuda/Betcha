import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import MyPopup from "../../../util/MyPopup";

function LeagueCard(props) {
  return (
    <Card fluid onClick={() => props.pickLeague(props.name)}>
      <Card.Content>
        <Image
          floated="left"
          size="mini"
          src={props.image}
          style={{ display: "inline-block" }}
        />
        <Card.Header style={{ display: "inline-block"}}>
          {props.name}
        </Card.Header>
        <Button
          onClick={() => props.pickLeague(props.name)}
          style={{ display: "inline-block", marginLeft: "20px" }}
        >
          Select League
        </Button>
      </Card.Content>
    </Card>
  );
}

export default LeagueCard;
