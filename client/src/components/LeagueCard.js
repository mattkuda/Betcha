import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import MyPopup from "../util/MyPopup";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

function LeagueCard({
  league: { name, image },
}) {

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated= "left"
          size= "mini"
          src = {image}
        />
        <Card.Header>{name}</Card.Header>
      </Card.Content>
    </Card>
  );
}

export default LeagueCard;
