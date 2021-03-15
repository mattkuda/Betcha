import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation, useEffect } from "@apollo/react-hooks";
import {
  Grid,
  Image,
  Form,
  Card,
  Button,
  Icon,
  Label,
  Modal,
} from "semantic-ui-react";
import moment from "moment";

import NotifCard from "../components/NotifCardStuff/NotifCard";
import { AuthContext } from "../context/auth";
import MyPopup from "../util/MyPopup";
import { Link } from "react-router-dom";

function NotificationsPage(props) {
  const { user } = useContext(AuthContext);

  const [followUser] = useMutation(READ_NOTIFICATIONS_MUTATION, {
    variables: { userId: user.id },
  });

  function testFunc(temp){
    console.log(temp)
  }

  React.useEffect(() => {
    testFunc("Uo");
  }, []);

  

  const { data: { getUserNotifications: notifications } = {} } = useQuery(
    FETCH_USER_NOTIFICATIONS_QUERY,
    {
      variables: { userId: user.id },
    }
  );

  console.log("The get user notifs are " + JSON.stringify(notifications));
  let userMarkup;

  // if (!getUser || !getUsernotifications) {
  if (!notifications) {
    //todo fix
    userMarkup = <p>Loading notifications...</p>;
  } else {
    userMarkup = (
      <>
        <Grid>
        <Grid.Row className="page-title">
            <h1>Notifications 👷🏾‍♂️</h1>
            <h4>Still need to build "readAt" functionality</h4>
          </Grid.Row>
          <Grid.Row>
            {notifications &&
              notifications.map((notification) => (
                <Grid.Column
                  key={notification.id}
                  style={{ marginBottom: 20 }}
                  width={16}
                >
                  <Link
                    to= {notification.objectType === "follow" ? `/user/${notification.sender.username}` : `/posts/${notification.objectId}`}
                    style={{ textDecoration: "normal" }}
                  >
                    <span className="card" style={{ display: "block" }}>
                      <NotifCard notification={notification} />
                    </span>
                  </Link>
                </Grid.Column>
              ))}
          </Grid.Row>
        </Grid>
        test
      </>
    );
  }

  return userMarkup;
}

const FETCH_USER_NOTIFICATIONS_QUERY = gql`
  {
    getUserNotifications {
      id
      sender {
        id
        name
      }
      objectType
      createdAt
      objectId
    }
  }
`;

const READ_NOTIFICATIONS_MUTATION = gql`
  mutation readNotifications{
    readNotifications {
      id
      sender {
        id
        name
      }
      objectType
      createdAt
      objectId
    }
  }
  
`;



export default NotificationsPage;
