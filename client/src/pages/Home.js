import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button, Loader, Icon, Card } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard/PostCard";
import ReactionCard from "../components/ReactionCard/ReactionCard";
import PostModal from "../components/PostModal/PostModal";
import GameSidebar from "../components/GameSidebar";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import '../App.css'
import './Home.css';

function Home() {
  const { user } = useContext(AuthContext);
  var loadingFeed = true;

  const { loading, data: { getPosts: posts } = {}, fetchMore } = useQuery(
    FETCH_POSTS_QUERY,
    {
      variables: { first: 20, offset: 0 },
    },
  );

  loadingFeed = false;
  const [modalOpen, setModalOpen] = useState(false);

  var random = Math.random() * 5;
  var loadingText = "";

  if (random < 1){
    loadingText = "Buffering drunk bets..."
  } else if (random < 2){
    loadingText = "Loading all winners..."
  } else if (random < 3){
    loadingText = "Loading all losers..."
  } else if (random < 4){
    loadingText = "Rendering mortal locks..."
  } else if (random < 4.95){
    loadingText = "Retrieving picks from the future..."
  } else if (random < 5){
    loadingText = "The odds of this happening were 1% ..."
  } 


  if(loading){
    return <Loader active inline='centered' size='large'>{loadingText}</Loader>
  }

  if(!user){
    return <Card style={{margin: "auto", marginTop: "20px", width: "75%"}}>
    <Card.Content>
      <h2 style={{textAlign: "center"}}><i>Welcome to Betcha Sports</i></h2>
      <img style={{display: "block",marginLeft: "auto", marginRight: "auto"}} src="android-chrome-192x192.png" alt=""/>
      <h3 style={{textAlign: "center"}}>Ready to join the action? <br/><Link to={`/login`} activeClassName="active">Login</Link> or <Link to={`/login`} activeClassName="active">signup</Link> today!</h3>
      <p style={{textAlign: "center", color: "gray", fontStyle: "italic"}}>Access limited for alpha release</p>
    </Card.Content>
      
    </Card>
  }

  return (
    <>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeIcon
        // dimmer="blurring" TODO
        style={{ height: "90%" }}
      >
        <Modal.Content long image scrolling style={{padding: "1px", width: "100%", height: "210%"}}>

          <PostModal handleClose={(e) => setModalOpen(false)} style={{height: "100%"}}/>

        </Modal.Content>
      </Modal>

      <Grid celled>
        <Grid.Column desktop={12} mobile={16}>
          <Grid.Row className="page-title">
            <h2>Home Feed</h2>
          </Grid.Row>
          <Grid.Row>
            {user ? (
              <Button onClick={(e) => setModalOpen(true)} className="mobile hidden tablet hidden">Share Bet</Button>
            ) : (
              <Button as={Link} to="/login" className="mobile hidden tablet hidden">
                Share Bet <Icon name="pencil"/>
              </Button>
            )}
          </Grid.Row>
          {loading || loadingFeed === true ? (
            <h1>Loading feed...</h1>
          ) : (
            //Transition group adds animation for when new post is added/deleted
            <Transition.Group>
              {posts &&
                posts.map((item, i) =>
                  item.postType === "P" ? (
                    <Grid.Column key={item.id} style={{ marginBottom: 20 }}>
                      <PostCard post={item} key={item.id} />
                      {i === posts.length - 5 && (
                        <Waypoint
                          onEnter={() =>
                            fetchMore({
                              variables: {
                                first: 20,
                                offset: posts.length - 1
                              },
                              updateQuery: (pv, {fetchMoreResult}) => {
                                if(!fetchMoreResult){
                                  return pv;
                                }
                                //console.log("The posts are: " +posts)
                                console.log("The pv are: " + JSON.stringify(pv))
                                //console.log("The fetchMoreResult are: " + JSON.stringify(fetchMoreResult))
                                return {

                                    __typename:"Post",
                                    getPosts:[...pv.getPosts, ...fetchMoreResult.getPosts],
                                    hasNextPage: true

                                }
                              }
                            })
                          }
                        />
                      )}
                    </Grid.Column>
                  ) : (
                    <Grid.Column key={item.id} style={{ marginBottom: 20 }}>
                      <ReactionCard reaction={item} key={item.id} />
                      {i === posts.length - 5 && (
                        <Waypoint
                          onEnter={() =>
                            fetchMore({
                              variables: {
                                first: 20,
                                offset: posts.length - 1
                              },
                              updateQuery: (pv, {fetchMoreResult}) => {
                                if(!fetchMoreResult){
                                  return pv;
                                }
                                //console.log("The posts are: " +posts)
                                console.log("The pv are: " + JSON.stringify(pv))
                                //console.log("The fetchMoreResult are: " + JSON.stringify(fetchMoreResult))
                                return {

                                    __typename:"Post",
                                    getPosts:[...pv.getPosts, ...fetchMoreResult.getPosts],
                                    hasNextPage: true

                                }
                              }
                            })
                          }
                        />
                      )}
                    </Grid.Column>
                  )
                )}
            </Transition.Group>
          )}

          {/* OLD SHIT v
          {(loading2 || loading) ? (
              <h1>Loading feed...</h1>
            ) : (

              //Transition group adds animation for when new post is added/deleted
              <Transition.Group>
              <h1>REACTIONS</h1>
                {reactions &&
                  reactions.map((reaction) => (
                    <Grid.Column key={reaction.id} style={{ marginBottom: 20 }}>

                          <ReactionCard reaction={reaction} key={reaction.id} />

                    </Grid.Column>
                  ))}
              </Transition.Group>
            )} */}
          {/* <Grid.Row>

            {loading ? (
              <h1>Loading posts...</h1>
            ) : (
              //Transition group adds animation for when new post is added/deleted
              <Transition.Group>
                {posts &&
                  posts.map((post) => (
                    <Grid.Column key={post.id} style={{ marginBottom: 20 }}>

                          <PostCard post={post} key={post.id} />

                    </Grid.Column>
                  ))}
              </Transition.Group>
            )}
          </Grid.Row> */}

        </Grid.Column>
        <Grid.Column width={4} className="mobile hidden tablet hidden">
          <Grid.Row className="page-title">
            <h2>Game Center</h2>
          </Grid.Row>
          <Grid.Row>
            <div className="games-sidebar-container">
              <div className="games-sidebar-content">
                <GameSidebar />
              </div>
            </div>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default Home;
