import React, { useState } from "react";
import { Button, Input, Form, Transition } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { storage } from "../../firebase";

import { useForm } from "../../util/hooks";

import { FETCH_POSTS_QUERY } from "../../util/graphql";

function EditInfoModal(props) {
  //Made this diff from og
  const { values, onChange, onSubmit } = useForm(updateInfoCallback, {
    name: props.name,
    bio: props.bio,
    location: props.location,
    website: props.website,
    profilePicture: null,
  });

  const [updateInfo, { error }] = useMutation(UPDATE_INFO_MUTATION, {
    variables: values,
    update(proxy, result) {
      //If successful, close modal
      props.handleClose();
    },
    //Added this so the page doesnt break
    onError(err) {
      return err;
    },
  });

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0] && e.target.files[0].size < 5242880) {
      setImage(e.target.files[0]);
    } else {
      e.target.value = null;
      alert("File too big. Must be less than 5 MB.");
    }
  };

  const uploadImages = async() =>{
    return new Promise((resolve, reject) => {
      console.log("Start of: uploadImages");

      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      
        uploadTask.on("state_changed", {
          error: error => {
            console.error(error);
            reject(error);
          },
          complete: () => {
            storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                console.log("the url is: " + url);
                values.profilePicture = url;
                console.log("End of: uploadImages");
                resolve();
                //return url;
              });
          }
        });
      });
    }
  

  const handleUpload = async () => {
    console.log("Start of: handleUpload");

    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            console.log("the url is: " + url);
            values.profilePicture = url;
            console.log("Start of: handleUpload");

            return url;
          });
      }
    );
  };

  async function updateInfoCallback() {
    //only upload if the image has changed
    if (image != null) {
      console.log("Start of: updateInfoCallback");
      await uploadImages();
      
      console.log('le values are: ' +JSON.stringify(values));
      updateInfo();
      console.log("End of: updateInfoCallback");

    } else {
      updateInfo();
    }
  }

  

  return (
    <div>
      <input
        type="file"
        onChange={handleChange}
        accept="image/png, image/jpeg"
      />
      <Form onSubmit={onSubmit}>
        <Form.Input
          label="Name"
          placeholder="name"
          name="name"
          type="text"
          value={values.name}
          onChange={onChange}
        />
        <Form.Input
          label="Bio"
          placeholder="bio"
          name="bio"
          type="text"
          value={values.bio}
          onChange={onChange}
        />
        <Form.Input
          label="Location"
          placeholder="location"
          name="location"
          type="text"
          value={values.location}
          onChange={onChange}
        />
        <Form.Input
          label="Website"
          placeholder="website"
          name="website"
          type="text"
          value={values.website}
          onChange={onChange}
        />
        <Button type="Submit" primary>
          {" "}
          Save
        </Button>
      </Form>
    </div>
  );
}

const UPDATE_INFO_MUTATION = gql`
  mutation updateInfo(
    $name: String!
    $bio: String!
    $location: String!
    $website: String!
    $profilePicture: String
  ) {
    updateInfo(
      name: $name
      bio: $bio
      location: $location
      website: $website
      profilePicture: $profilePicture
    ) {
      id
      username
      createdAt
      name
      location
      bio
      website
      followers {
        followerId
      }
      following {
        followeeId
      }
      followingCount
      followersCount
    }
  }
`;

export default EditInfoModal;
