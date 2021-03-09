import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button, Loader, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard/PostCard";
import ReactionCard from "../components/ReactionCard/ReactionCard";
import PostModal from "../components/PostModal/PostModal";
import GameSidebar from "../components/GameSidebar";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { FETCH_REACTIONS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  var loadingFeed = true;

  // const QueryMultiple = () => {
  //   const res1 = useQuery(FETCH_POSTS_QUERY);
  //   const res2 = useQuery(FETCH_REACTIONS_QUERY);
  //   return [res1, res2];
  // };

  // const [
  //   { loading, data: { getPosts: posts } = {} },
  //   { loading2, data: { getReactionsFromFollowees: reactions } = {} },
  // ] = QueryMultiple();

  const { loading, data: { getPosts: posts } = {}, fetchMore } = useQuery(
    FETCH_POSTS_QUERY,
    {
      variables: { first: 5, offset: 0 },
    },
  );

  // const {
  //   loading2,
  //   data: { getReactionsFromFollowees: reactions } = {},
  // } = useQuery(FETCH_REACTIONS_QUERY);
  // const feedItems = mergeLists(posts, reactions)

  loadingFeed = false;
  const [modalOpen, setModalOpen] = useState(false);

  function mergeLists(list1, list2) {
    var items = [];
    items = items
      .concat(list1)
      .concat(list2)
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    return items;
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
        <Modal.Header>Share Bet</Modal.Header>
        <Modal.Content image scrolling>
          <PostModal handleClose={(e) => setModalOpen(false)} />
        </Modal.Content>
      </Modal>

      <Grid celled>
        <Grid.Column width={12}>
          <Grid.Row className="page-title">
            <h1>Recent posts</h1>
          </Grid.Row>
          <Grid.Row>
            {user ? (
              <Button onClick={(e) => setModalOpen(true)}>Share Bet</Button>
            ) : (
              <Button as={Link} to="/login">
                Share Bet
              </Button>
            )}
            <Button onClick={(e) => console.log(posts)}>Console Posts</Button>
          </Grid.Row>
          {loading || loadingFeed === true ? (
            <h1>Loading feed...</h1>
          ) : (
            //Transition group adds animation for when new post is added/deleted
            <Transition.Group>
              <h1>feed mock</h1>
              {posts &&
                posts.map((item, i) =>
                  item.postType === "P" ? (
                    <Grid.Column key={item.id} style={{ marginBottom: 20 }}>
                      <PostCard post={item} key={item.id} />
                      {i === posts.length - 1 && (
                        <Waypoint
                          onEnter={() =>
                            fetchMore({
                              variables: { 
                                first: 5, 
                                offset: posts[posts.length - 1].id 
                              }, 
                              updateQuery: (pv, {fetchMoreResult}) => {
                                if(!fetchMoreResult){
                                  return pv;
                                }
                                return {
                                  posts: {
                                    __typename:'Post',
                                    posts:[...pv.posts, fetchMoreResult.posts]
                                    
                                  }
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
                      {i === posts.length - 1 && (
                        <Waypoint
                          onEnter={() =>
                            fetchMore({
                              variables: { 
                                first: 5, 
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
        <Grid.Column width={4}>
          <Grid.Row className="page-title">
            <h1>Game Center</h1>
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
