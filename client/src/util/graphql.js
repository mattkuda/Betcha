import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      betType
      betAmount
      gamePre
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export const FETCH_NCCABMENS_GAMEPRES_QUERY = gql`
  {
    getNCAABMensPregames {
      id
      state
      stateDetails
      sport
      league
      homeLogo
      awayLogo
      homeAbbreviation
      awayAbbreviation
      homeFullName
      awayFullName
      homeColor
      awayColor
      homeRecord
      awayRecord
      startTime
      spread
      overUnder
    }
  }
`;

// export const FETCH_NFL_PREGAMES_QUERY = gql`
//   {
//     getNFLPregames {
//       id
//       homeFullName
//       awayFullName
//     }
//   }
// `;
