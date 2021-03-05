import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button, Feed, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard/PostCard";
import ReactionCard from "../components/ReactionCard/ReactionCard";
import PostModal from "../components/PostModal/PostModal";
import GameSidebar from "../components/GameSidebar";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { FETCH_REACTIONS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  var loadingFeed = true;
  const { loading2, data: { getReactionsFromFollowees: reactions } = {} } = useQuery(
    FETCH_REACTIONS_QUERY
  );

  const feedItems = [].concat(posts).concat(reactions).sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
  loadingFeed = false;
  const [modalOpen, setModalOpen] = useState(false);

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
            <Button onClick={(e) => console.log(feedItems)}>Console Reacts</Button>
            <Button onClick={(e) => feedItems.map(o => console.log(o.__typename))}>Console types</Button>

          </Grid.Row>
          {(loading2 || loading || loadingFeed == true) ? (
              <h1>Loading feed...</h1>
            ) : (
              
              //Transition group adds animation for when new post is added/deleted
              <Transition.Group>
              <h1>feed mock</h1>
                {feedItems &&
                  feedItems.map((item) => (
                    item.__typename == "Post" ?
                    <Grid.Column key={item.id} style={{ marginBottom: 20 }}>

                          <PostCard post={item} key={item.id} />

                    </Grid.Column>
                    :
                    <Grid.Column key={item.id} style={{ marginBottom: 20 }}>

                          <ReactionCard reaction={item} key={item.id} />

                    </Grid.Column>
                  ))}
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
