import React, { useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Image, List, Container, Segment, Loader, Grid } from 'semantic-ui-react'
import { FETCH_USERS_WHO_POSTED_ABOUT_GAME } from "../util/graphql";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

import "./FriendLinker.css"


function storeOdds(post, odds) {
  for (const game of post.gameArray) {
    odds.push({
      betOdds: post.betOdds,
      betType: game.betType,
      betAmount: game.betAmount,
    });
  }
}

function findMatchingOdds(betType, betAmount, odds) {
  for (const item of odds) {
    if (item.betType === betType && item.betAmount === betAmount) {
      return item.betOdds;
    }
  }
}

function FriendLinker(props) {

  const myGameId = props.gameId;
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(FETCH_USERS_WHO_POSTED_ABOUT_GAME, {
    variables: { myGameId },
    pollInterval: 30000,
  });

  const myOdds = [];

  if (loading) return "Loading...";
  if (error) return "Error occurred!";

  return (
    <div>
      {user ? (
        <Segment raised>
          {data.getPostsAboutGame.length > 0 ? (
            <List horizontal relaxed size='medium'>
                  <Fragment>
                    {
                      data.getPostsAboutGame.map(post => (
                        <>
                        {storeOdds(post, myOdds)}
                        <List.Item>
                          <Link to={`/user/${post.user.username}`}>
                            <Image avatar src={post.user.profilePicture} size='tiny' />
                          </Link>
                          <List.Content>
                            <List.Header as='a'>@{post.user.username}</List.Header>
                            <List.Description>
                              {post.gameArray.map(game => (
                                game.gameId.gameId === myGameId ? (
                                  <>
                                    {game.betType === "HOME" ? (
                                      <>
                                        {game.gameId.homeAbbreviation}
                                      </>
                                    ):(
                                      <>
                                        {game.gameId.awayAbbreviation}
                                      </>
                                    )}
                                    {game.betAmount === "0" ? (
                                      " ML"
                                    ):(
                                      <>
                                        {' '}{game.betAmount}
                                      </>
                                    )} ({findMatchingOdds(game.betType, game.betAmount, myOdds)})
                                  </>
                                ):(<></>)
                              ))}
                            </List.Description>
                          </List.Content>
                        </List.Item>
                        </>
                      ))
                    }
                  </Fragment>
            </List>
          ):(<p>No bets to display</p>)}
        </Segment>
      ):(
        <p>Log in to see activity!</p>
      )}
    </div>
  )

}

export default FriendLinker;
