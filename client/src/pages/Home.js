import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Modal, Button } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import PostModal from "../components/PostModal/PostModal";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { FETCH_GAMEPRES_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon>
        <Modal.Header>Share Bet</Modal.Header>
        <Modal.Content>
          <PostModal handleClose={(e) => setModalOpen(false)} />
        </Modal.Content>
      </Modal>

      <Grid columns="one">
        <Grid.Row className="page-title">
          <h1>Recent posts</h1>
        </Grid.Row>
        <Grid.Row>
          <Button onClick={(e) => setModalOpen(true)}>Share Bet</Button>
        </Grid.Row>
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
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}

export default Home;
