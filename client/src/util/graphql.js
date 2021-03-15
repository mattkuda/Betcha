import gql from "graphql-tag";

//NOTIFS
export const CREATE_NOTIFICATION_MUTATION = gql`
  mutation createNotification($receiver: ID!, $type: String, $objectId: ID!) {
    createNotification(receiver: $receiver, type: $type, objectId: $objectId) {
      id
    }
  }
`;

export const FETCH_USERS_FOR_USER_SEARCH_QUERY = gql`
  {
    getAllUsers {
      id
      username
      name
      profilePicture
    }
  }
`;

export const FETCH_USERS_WHO_POSTED_ABOUT_GAME = gql`
  query($myGameId: String!) {
    getPostsAboutGame(gameId: $myGameId) {
      gameArray {
        betAmount
        betType
        gameId {
          gameId
          homeAbbreviation
          awayAbbreviation
        }
      }
      user {
        id
        username
        name
        profilePicture
      }
      betOdds
    }
  }
`;

export const FETCH_TOP_PREGAME_EVENTS = gql`
  {
    getTopPregameEvents {
      id
      game {
        id
        gameId
        state
        stateDetails
        sport
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
      rank
    }
  }
`;

export const FETCH_TOP_LIVEGAME_EVENTS = gql`
  {
    getTopLivegameEvents {
      id
      game {
        id
        gameId
        state
        stateDetails
        sport
        league
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
        lastPlay
        time
        period
        spread
        overUnder
      }
      rank
    }
  }
`;

export const FETCH_POSTS_QUERY = gql`
  query($first: Int!, $offset: Int!) {
    getPosts(first: $first, offset: $offset) {
      id
      postType
      body
      betOdds
      post {
        id
        body
        username
        betOdds
        gameArray {
          gameId {
            gameId
            stateDetails
            homeScore
            awayScore
            period
            time
            awayAbbreviation
            homeAbbreviation
            awayScore
            homeScore
            spread
            overUnder
          }
          betType
          betAmount
        }
      }
      playId {
        game {
          sport
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
        description
        specificData {
          homeScore
          awayScore
          time
          half
          quarter
          possession
        }
      }
      gameArray {
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
        betType
        betAmount
      }
      createdAt
      username
      likeCount
      likes {
        username
      }
      user {
        id
        name
        profilePicture
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

//REACTIONS
export const FETCH_REACTIONS_QUERY = gql`
  {
    getReactionsFromFollowees {
      __typename
      id
      body
      userId {
        username
        profilePicture
        name
      }
      playId {
        game {
          gameId
        }
        description
      }
      createdAt
      post {
        id
        body
        betOdds
        gameArray {
          gameId {
            gameId
            stateDetails
            homeScore
            awayScore
            period
            time
            awayAbbreviation
            homeAbbreviation
            awayScore
            homeScore
            spread
            overUnder
          }
          betType
          betAmount
        }
        createdAt
        username
        user {
          id
          name
          profilePicture
        }
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
  query($myLeague: String!, $myFirst: Int, $myOffset: Int) {
    getPregamesByLeague(league: $myLeague, first: $myFirst, offset: $myOffset) {
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
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

export const FETCH_HEADER_INFO_FOR_GAME = gql`
  query($myGameId: String!) {
    getGameByID(gameId: $myGameId) {
      homeId
      awayId
      favoredTeamId
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
      homeColor
      awayColor
      spread
      overUnder
      awayML
      homeML
      spread
      overUnder
      awaySpreadOdds
      homeSpreadOdds
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
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
      spread
      overUnder
      spreadWinner
      ouResult
    }
  }
`;

export const FETCH_NBA_GAME = gql`
  query($gameId: String!) {
    getGameByID(gameId: $gameId) {
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
      spread
      overUnder
      spreadWinner
      ouResult
    }
  }
`;

//NHL GAME QUERIES

export const FETCH_NHL_PREGAMES = gql`
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
    }
  }
`;

export const FETCH_NHL_LIVEGAMES = gql`
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
      lastPlay
      specificData {
        possession
      }
    }
  }
`;

export const FETCH_NHL_POSTGAMES = gql`
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
      spread
      overUnder
      spreadWinner
      ouResult
    }
  }
`;

//PREMIER LEAGUE GAME QUERIES

export const FETCH_PREMIER_LEAGUE_PREGAMES = gql`
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
    }
  }
`;

export const FETCH_PREMIER_LEAGUE_LIVEGAMES = gql`
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
      lastPlay
      specificData {
        possession
      }
    }
  }
`;

export const FETCH_PREMIER_LEAGUE_POSTGAMES = gql`
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
      spread
      overUnder
      spreadWinner
      ouResult
    }
  }
`;

//MLS GAME QUERIES

export const FETCH_CHAMPIONS_LEAGUE_PREGAMES = gql`
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
    }
  }
`;

export const FETCH_CHAMPIONS_LEAGUE_LIVEGAMES = gql`
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
      homeSpreadOdds
      awaySpreadOdds
      homeML
      awayML
      overUnder
      overOdds
      underOdds
      lastPlay
      specificData {
        possession
      }
    }
  }
`;

export const FETCH_CHAMPIONS_LEAGUE_POSTGAMES = gql`
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
      scoreValue
      game {
        homeLogo
        awayLogo
        homeFullName
        awayFullName
        homeAbbreviation
        awayAbbreviation
        homeId
        awayId
      }
      specificData {
        homeScore
        awayScore
        time
        half
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
      scoreValue
      game {
        homeLogo
        awayLogo
        homeFullName
        awayFullName
        homeAbbreviation
        awayAbbreviation
        homeId
        awayId
      }
      specificData {
        homeScore
        awayScore
        time
        quarter
        possession
      }
    }
  }
`;

export const FETCH_PLAYS_IN_NHL_GAME = gql`
  query($myGameId: String!) {
    getPlaysInGame(gameId: $myGameId) {
      id
      playId
      description
      scoreValue
      game {
        homeLogo
        awayLogo
        homeFullName
        awayFullName
        homeAbbreviation
        awayAbbreviation
        homeId
        awayId
      }
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

export const FETCH_PLAYS_IN_PREMIER_LEAGUE_GAME = gql`
  query($myGameId: String!) {
    getPlaysInGame(gameId: $myGameId) {
      id
      playId
      description
      scoreValue
      game {
        homeLogo
        awayLogo
        homeFullName
        awayFullName
        homeAbbreviation
        awayAbbreviation
        homeId
        awayId
      }
      specificData {
        homeScore
        awayScore
        time
        half
      }
    }
  }
`;

export const FETCH_PLAYS_IN_NBA_GAME_IN_PERIOD = gql`
  query($myGameId: String!, $myPeriod: Int!) {
    getPlaysInNBAGameInPeriod(gameId: $myGameId, currentPeriod: $myPeriod) {
      id
      playId
      description
      scoreValue
      game {
        homeLogo
        awayLogo
        homeFullName
        awayFullName
        homeAbbreviation
        awayAbbreviation
        homeId
        awayId
      }
      specificData {
        homeScore
        awayScore
        time
        quarter
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
      awaySpreadOdds
      homeSpreadOdds
      awayML
      homeML
      overUnder
      overOdds
      underOdds
      favoredTeam
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
      id
      displayName
      sportName
      leagueName
      image
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
