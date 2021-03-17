import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";
import "../../App.css";

function NotificationsIcon({ user }) {
  const { data: { getUserNotifications: notifications } = {} } = useQuery(
    FETCH_NOTIFICATIONS_QUERY,
    {
      variables: { userId: user.id },
    }
  );

  // const NotificationsIcon = user ? (
  //   notificationCount > 0 ? (
  //     <>
  //       <Icon name="bell outline" />
  //       <Label
  //         color="red"
  //         floating
  //         style={{ padding: "2px 3px", top: "10px", left: "47px" }}
  //       >
  //         {notificationCount}
  //       </Label>
  //     </>
  //   ) : (
  //     <>
  //       <Icon name="bell outline" />
  //     </>
  //   )
  // ) : (
  //   <></>
  // );

  //use above once working
  const NotificationsIcon = user ? (
    <>
    <div className="mobile only">
      {notifications ? (
        <>
          {notifications.length > 0 ? (
            <>
              <Icon name="bell outline" size="large" />
              <Label
                color="red"
                floating
                style={{ padding: "2px 3px", top: "10px", left: "47px" }}
              >
                {notifications.length}
              </Label>
            </>
          ) : (
            <>
              <Icon name="bell outline" size="large"  />
            </>
          )}
        </>
      ) : (
        <>
          <Icon name="bell outline" size="large"  />
        </>
      )}
    </div>
    <div className="mobile hidden">
      {notifications ? (
        <>
          {notifications.length > 0 ? (
            <>
              <Icon name="bell outline" size="large" />
              <Label
                color="red"
                floating
                style={{ padding: "2px 3px", top: "10px", left: "47px" }}
              >
                {notifications.length}
              </Label>
            </>
          ) : (
            <>
              <Icon name="bell outline"  />
            </>
          )}
        </>
      ) : (
        <>
          <Icon name="bell outline" />
        </>
      )}
    </div>
    </>
  ) : (
    <></>
  );

  return <>{NotificationsIcon}</>;
}

const FETCH_NOTIFICATIONS_QUERY = gql`
  {
    getUserNotifications {
      id
      sender {
        id
      }
    }
  }
`;

export default NotificationsIcon;
