import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      betType
      betAmount
      gameId {
        homeFullName
        awayFullName
        homeRecord
        awayRecord
        awayLogo
        homeLogo
        awayAbbreviation
        homeAbbreviation
        startTime
        broadcasts
        spread
        overUnder
      }
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
      eventId
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

export const FETCH_NCAAF_PREGAMES = gql`
  {
    getNCAAFPregames {
      id
      state
      stateDetails
      homeFullName
      awayFullName
      homeRecord
      awayRecord
      awayLogo
      homeLogo
      awayAbbreviation
      homeAbbreviation
      startTime
      broadcasts
      spread
      overUnder
      specificData {
        weatherDescription
        homeRank
        awayRank
      }
    }
  }
`;


export const FETCH_ALL_PREGAMES = gql`
  {
    getAllPregames {
      id
      eventId
      league
      homeFullName
      awayFullName
      homeRecord
      awayRecord
      awayLogo
      homeLogo
      awayAbbreviation
      homeAbbreviation
      startTime
      broadcasts
      spread
      overUnder
    }
  }
`;


export const FETCH_LEAGUES_QUERY = gql`
  {
    getLeagues {
      id
      displayName
      leagueName
      image
    }
  }
`;

export const FETCH_ACTIVE_LEAGUES_QUERY = gql`
  {
    getActiveLeagues {
      sportName
      leagueName
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
