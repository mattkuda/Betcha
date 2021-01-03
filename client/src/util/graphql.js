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
        stateDetails
        homeRecord
        awayRecord
        homeScore
        awayScore
        period
        time
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
      user{
        name
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



//NFL GAME QUERIES

export const FETCH_NFL_PREGAMES = gql`
  query($myLeague: String!) {
    getPregamesByLeague(league: $myLeague) {
      id
      gameId
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
      }
    }
  }
`;

export const FETCH_NFL_LIVEGAMES = gql`
  query($myLeague: String!) {
    getLivegamesByLeague(league: $myLeague) {
      id
      gameId
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
      homeScore
      awayScore
      startTime
      broadcasts
      time
      period
      spread
      overUnder
      lastPlay
      specificData {
        down
        distance
        yardLine
        isRedZone
        possession
      }
    }
  }
`;


export const FETCH_NFL_POSTGAMES = gql`
  query($myLeague: String!) {
    getPostgamesByLeague(league: $myLeague) {
      id
      gameId
      state
      stateDetails
      homeFullName
      awayFullName
      homeRecord
      awayRecord
      homeLogo
      awayLogo
      homeAbbreviation
      awayAbbreviation
      homeScore
      awayScore
      homeLines
      awayLines
      spread
      overUnder
      spreadWinner
      ouResult
    }
  }
`;



//NCAAF GAME QUERIES

export const FETCH_NCAAF_PREGAMES = gql`
  query($myLeague: String!) {
    getPregamesByLeague(league: $myLeague) {
      id
      gameId
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

export const FETCH_NCAAF_LIVEGAMES = gql`
  query($myLeague: String!) {
    getLivegamesByLeague(league: $myLeague) {
      id
      gameId
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
      homeScore
      awayScore
      startTime
      broadcasts
      time
      period
      spread
      overUnder
      lastPlay
      specificData {
        homeRank
        awayRank
        down
        distance
        yardLine
        isRedZone
        possession
      }
    }
  }
`;


export const FETCH_NCAAF_POSTGAMES = gql`
  query($myLeague: String!) {
    getPostgamesByLeague(league: $myLeague) {
      id
      gameId
      state
      stateDetails
      homeFullName
      awayFullName
      homeRecord
      awayRecord
      homeLogo
      awayLogo
      homeAbbreviation
      awayAbbreviation
      homeScore
      awayScore
      homeLines
      awayLines
      spread
      overUnder
      spreadWinner
      ouResult
      specificData {
        homeRank
        awayRank
      }
    }
  }
`;



//NCAAB MENS GAME QUERIES

export const FETCH_NCAABMENS_PREGAMES = gql`
  query($myLeague: String!) {
    getPregamesByLeague(league: $myLeague) {
      id
      gameId
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
        homeRank
        awayRank
      }
    }
  }
`;

export const FETCH_NCAABMENS_LIVEGAMES = gql`
  query($myLeague: String!) {
    getLivegamesByLeague(league: $myLeague) {
      id
      gameId
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
      homeScore
      awayScore
      startTime
      broadcasts
      time
      period
      spread
      overUnder
      lastPlay
      specificData {
        homeRank
        awayRank
        possession
      }
    }
  }
`;


export const FETCH_NCAABMENS_POSTGAMES = gql`
  query($myLeague: String!) {
    getPostgamesByLeague(league: $myLeague) {
      id
      gameId
      state
      stateDetails
      homeFullName
      awayFullName
      homeRecord
      awayRecord
      homeLogo
      awayLogo
      homeAbbreviation
      awayAbbreviation
      homeScore
      awayScore
      homeLines
      awayLines
      spread
      overUnder
      spreadWinner
      ouResult
      specificData {
        homeRank
        awayRank
      }
    }
  }
`;




//NBA GAME QUERIES

export const FETCH_NBA_PREGAMES = gql`
  query($myLeague: String!) {
    getPregamesByLeague(league: $myLeague) {
      id
      gameId
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
    }
  }
`;

export const FETCH_NBA_LIVEGAMES = gql`
  query($myLeague: String!) {
    getLivegamesByLeague(league: $myLeague) {
      id
      gameId
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
      homeScore
      awayScore
      startTime
      broadcasts
      time
      period
      spread
      overUnder
      lastPlay
      specificData {
        possession
      }
    }
  }
`;


export const FETCH_NBA_POSTGAMES = gql`
  query($myLeague: String!) {
    getPostgamesByLeague(league: $myLeague) {
      id
      gameId
      state
      stateDetails
      homeFullName
      awayFullName
      homeRecord
      awayRecord
      homeLogo
      awayLogo
      homeAbbreviation
      awayAbbreviation
      homeScore
      awayScore
      homeLines
      awayLines
      spread
      overUnder
      spreadWinner
      ouResult
    }
  }
`;


//PLAY QUERIES

export const FETCH_PLAYS_IN_NFL_GAME = gql`
  query($myGameId: String!) {
    getPlaysInGame(gameId: $myGameId) {
      id
      playId
      description
      specificData {
        homeScore
        awayScore
        time
        period
        down
        distance
        yardLine
        possession
      }
    }
  }
`;

export const FETCH_PLAYS_IN_NCAAF_GAME = gql`
  query($myGameId: String!) {
    getPlaysInGame(gameId: $myGameId) {
      id
      playId
      description
      specificData {
        homeScore
        awayScore
        time
        period
        down
        distance
        yardLine
        possession
      }
    }
  }
`;

export const FETCH_PLAYS_IN_NCAABMENS_GAME = gql`
  query($myGameId: String!) {
    getPlaysInGame(gameId: $myGameId) {
      id
      playId
      description
      specificData {
        homeScore
        awayScore
        time
        period
        possession
      }
    }
  }
`;


export const FETCH_PLAYS_IN_NBA_GAME = gql`
  query($myGameId: String!) {
    getPlaysInGame(gameId: $myGameId) {
      id
      playId
      description
      specificData {
        homeScore
        awayScore
        time
        period
        possession
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


export const FETCH_ALL_PREGAMES = gql`
  {
    getAllPregames {
      id
      gameId
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
