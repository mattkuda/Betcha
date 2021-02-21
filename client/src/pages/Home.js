import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button, Feed, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard/PostCard";
import PostModal from "../components/PostModal/PostModal";
import GameSidebar from "../components/GameSidebar";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeIcon
        dimmer="blurring"
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
          <br />
          <Grid.Row>
            {/* {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )} */}
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
          </Grid.Row>
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
