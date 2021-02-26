/*
Updates games within our database, making use of the ESPN API to obtain information about each game.
*/

//import mongoose models
const Pregame = require("../models/Pregame");
const Livegame = require("../models/Livegame");
const Postgame = require("../models/Postgame");
const Play = require("../models/Play");
const TopEvent = require("../models/TopEvent");
const League = require("../models/League");

//import libraries
const fetch = require("node-fetch");


//define constants here
const LIVE_TICK_INTERVAL = 30000;   //30 seconds
const TOTAL_PREGAME_DAYS = 16;
const ONE_DAY_IN_MS = 86400000;   //24 hrs
const TODAYS_GAMES_ODDS_UPDATE_INTERVAL = 1800000  //30 mins
const TOP_EVENT_INTERVAL = 3600000  //60 mins
const GENERAL_UPDATE_INTERVAL = 10800000  //3 hrs


class GameService {
  constructor() {
    this.ctr = 1;
    this.sport_list = [];
  }


  /*
  Checks if an element exists within a JSON file before trying to access it. Used to handle
  potential corner cases when working with the ESPN data.
  */
  elementExists(prop_parent, prop) {
    return prop_parent.hasOwnProperty(prop);
  }


  /*
  Converts a UTC date string into a YYYYMMDD format, used for the API URLs.
  */
  convertDate(day) {
    var dd = String(day.getDate()).padStart(2, '0');
    var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = day.getFullYear();

    return yyyy+mm+dd
  }


  /*
  Function to determine which team covered the spread.
  */
  calculateSpreadWinner(homeScore, awayScore, homeAbbreviation, awayAbbreviation, favoredTeam, spread) {

    //corner case - checking if the game was a pick-em
    if (spread === 0) {
      if (homeScore > awayScore) {
        return homeAbbreviation;
      }
      if (awayScore > homeScore) {
        return awayAbbreviation;
      }
      return "P";
    }

    //if home team is favored
    if (favoredTeam === homeAbbreviation) {
      if (homeScore - awayScore > spread) {
        return homeAbbreviation;
      } else if (homeScore - awayScore < spread) {
        return awayAbbreviation;
      }
      return "P";
    }

    //if away team is favored
    else if (favoredTeam === awayAbbreviation) {
      if (awayScore - homeScore > spread) {
        return awayAbbreviation;
      } else if (awayScore - homeScore < spread) {
        return homeAbbreviation;
      }
      return "P";
    }

    //if neither favored
    else {
      if (homeScore - awayScore !== 0) {
        let highestScore = Math.max(homeScore, awayScore);
        if (homeScore === highestScore) {
          return homeAbbreviation;
        } else if (awayScore === highestScore) {
          return awayAbbreviation;
        }
        return "P";
      }
    }
  }


  /*
  Function to determine if the game went over or under.
  */
  calculateOuResult(totalScore, ou) {
    if (totalScore < ou) return "U";
    if (totalScore > ou) return "O";
    return "P";
  }



  /*
  This is our "main()" function - we call it within the index.js file to start the game service.
  */
  run() {
    this.fillSportListAndTick();
    this.timerID = setInterval(() => {
      this.tick();
      if (this.ctr < (ONE_DAY_IN_MS / LIVE_TICK_INTERVAL)) {
        this.ctr = this.ctr + 1;
      } else {
        this.ctr = 1;
      }
    }, LIVE_TICK_INTERVAL);
  }


  /*
  First, grab all the active leagues from the DB and do an initial tick.
  */
  async fillSportListAndTick() {
    this.sport_list = await League.find({ isActive: true });
    this.tick();
    this.ctr = this.ctr + 1;
  }


  /*
  Runs at each tick interval. Loops through all sports and checks for upcoming, live,
  or completed games.
  */
  async tick() {
    for (const item of this.sport_list) {
      let sport = item.sportName;
      let league = item.leagueName;
      let allCollegeTeams = "";

      //if this is a college sport, make sure we're querying all D1 games
      if (league.indexOf("college") !== -1) {
        allCollegeTeams="&groups=50"
      }

      if (this.ctr === 1) {
        this.addUpcomingGames(sport, league, allCollegeTeams);
      }
      if (this.ctr === TODAYS_GAMES_ODDS_UPDATE_INTERVAL / LIVE_TICK_INTERVAL) {
        this.updateOddsForTodaysGames(sport, league, allCollegeTeams);
      }
      if (this.ctr === TOP_EVENT_INTERVAL / LIVE_TICK_INTERVAL) {
        const url = "http://site.api.espn.com/apis/v2/scoreboard/header?id=0";
        const response = await fetch(url);
        const data = await response.json();
        console.log("Processing top events");
        this.processTopEvents(data.sports);
      }
      if (this.ctr === GENERAL_UPDATE_INTERVAL / LIVE_TICK_INTERVAL) {
        this.updateVariableGameInfo(sport, league, allCollegeTeams);
      }
      this.processData(sport, league, allCollegeTeams);   //livegames and postgames
    }
  }


  /*
  Used to process the top upcoming events (determined by ESPN) and update the DB accordingly.
  */
  async processTopEvents(sports) {
    for (const sport of sports) {
      for (const league of sport.leagues) {
        for (const game of league.events) {
          const gameExists = await TopEvent.exists({ gameId: game.id });
          const gameInPregame = await Pregame.exists({ gameId: game.id });
          if (gameExists === false && gameInPregame === true && game.status === "pre") {
            console.log("Adding new top event...");
            let topEvent = new TopEvent({
              gameId: game.id,
              rank: game.priority,
              gameState: game.status
            });
            topEvent.save();
          }
        }
      }
    }
  }


  /*
  Add upcoming games for the next 2 weeks.
  */
  async addUpcomingGames(sport, league, college) {
    var day = new Date();
    var next;
    var day_ctr = 1;
    while (day_ctr < TOTAL_PREGAME_DAYS) {
      const url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
      sport+"&league="+league+college+"&dates="+this.convertDate(day);
      const response = await fetch(url);
      const data = await response.json();
      console.log("Processing data for " + league);
      if (this.elementExists(data.sports[0].leagues[0], "events")) {
        this.addGamesForDay(data.sports[0].leagues[0].events, sport, league);
      }
      console.log("Date (today): "+this.convertDate(day));
      next = new Date(day.valueOf() + ONE_DAY_IN_MS);
      day = next;
      day_ctr++;
    }
  }


  /*
  Update all game info for games in DB
  */
  async updateVariableGameInfo(sport, league, college) {
    var day = new Date();
    var next;
    var day_ctr = 1;
    while (day_ctr < TOTAL_PREGAME_DAYS) {
      const url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
      sport+"&league="+league+college+"&dates="+this.convertDate(day);
      const response = await fetch(url);
      const data = await response.json();
      console.log("Processing data for " + league);
      if (this.elementExists(data.sports[0].leagues[0], "events")) {
        this.updateGameInfoForDay(data.sports[0].leagues[0].events, sport, league);
      }
      console.log("Date (today): "+this.convertDate(day));
      next = new Date(day.valueOf() + ONE_DAY_IN_MS);
      day = next;
      day_ctr++;
    }
  }


  /*
  Helper function for updateVariableGameInfo(), gets called for each day.
  */
  async updateGameInfoForDay(data, sport, league) {
    for (const game of data) {
      let result = await Pregame.findOne({ gameId: game.id });
      if (result) {
        console.log("Updating variable data for upcoming game...");

        if (this.elementExists(game, "broadcasts")) {
          if (game.broadcasts.length > 0) {
            let myBroadcasts = []
            for (const broadcast of game.broadcasts) {
              myBroadcasts.push(broadcast.name);
            }
            result.broadcasts = myBroadcasts;
          }
        }
        if (this.elementExists(game.competitors[0], "record")) {
          if (sport === "hockey") {
            result.homeRecord = game.competitors[0].shortenedRecord;
          }
          else { result.homeRecord = game.competitors[0].record; }
        }
        if (this.elementExists(game.competitors[1], "record")) {
          if (sport === "hockey") {
            result.awayRecord= game.competitors[1].shortenedRecord;
          }
          else { result.awayRecord = game.competitors[1].record; }
        }


        if (this.elementExists(game, "odds")) {

          if (this.elementExists(game.odds, "overUnder")) {
            result.overUnder = game.odds.overUnder;
          }

          if (this.elementExists(game.odds, "spread")) {
            result.spread = Math.abs(game.odds.spread);
          }

          if (this.elementExists(game.odds, "overOdds")) {
            result.overOdds = game.odds.overOdds;
          }

          if (this.elementExists(game.odds, "underOdds")) {
            result.underOdds = game.odds.underOdds;
          }

          if (this.elementExists(game.odds, "awayTeamOdds")) {

            if (this.elementExists(game.odds.awayTeamOdds, "moneyLine")) {
              result.awayML = game.odds.awayTeamOdds.moneyLine;
            }

            if (this.elementExists(game.odds.awayTeamOdds, "favorite") &&
            game.odds.awayTeamOdds.favorite === true) {
              result.favoredTeam = game.odds.awayTeamOdds.team.abbreviation;
              result.favoredTeamId = game.odds.awayTeamOdds.team.id;
            }

            if (this.elementExists(game.odds.awayTeamOdds, "spreadOdds")) {
              result.awaySpreadOdds = game.odds.awayTeamOdds.spreadOdds;
            }

          }


          if (this.elementExists(game.odds, "homeTeamOdds")) {

            if (this.elementExists(game.odds.homeTeamOdds, "moneyLine")) {
              result.homeML = game.odds.homeTeamOdds.moneyLine;
            }

            if (this.elementExists(game.odds.homeTeamOdds, "favorite") &&
            game.odds.homeTeamOdds.favorite === true) {
              result.favoredTeam = game.odds.homeTeamOdds.team.abbreviation;
              result.favoredTeamId = game.odds.homeTeamOdds.team.id;
            }

            if (this.elementExists(game.odds.homeTeamOdds, "spreadOdds")) {
              result.homeSpreadOdds = game.odds.homeTeamOdds.spreadOdds;
            }

          }

          if (result.sport === "soccer" && this.elementExists(game.odds, "drawOdds")) {
            if (this.elementExists(game.odds.drawOdds, "moneyLine")) {
              result.drawML = game.odds.drawOdds.moneyLine;
            }
          }
        }

        result.stateDetails = game.fullStatus.type.name;
        result.homeId = parseInt(game.competitors[0].id);
        result.awayId = parseInt(game.competitors[1].id);
        result.homeLogo = game.competitors[0].logo;
        result.awayLogo = game.competitors[1].logo;
        result.homeAbbreviation = game.competitors[0].abbreviation;
        result.awayAbbreviation = game.competitors[1].abbreviation;
        result.homeFullName = game.competitors[0].displayName;
        result.awayFullName = game.competitors[1].displayName;
        result.homeColor = game.competitors[0].color;
        result.awayColor = game.competitors[1].color;
        result.startTime = game.date;
        result.playByPlayAvailable = game.playByPlayAvailable;
        result.location = game.location;

        //adding league-specific data
        switch (league) {
          case "college-football":
          case "mens-college-basketball":
            if (this.elementExists(game.competitors[0], "rank")) {
              result.specificData.homeRank = game.competitors[0].rank;
            }
            if (this.elementExists(game.competitors[1], "rank")) {
              result.specificData.awayRank = game.competitors[1].rank;
            }
            break;
          case "nhl":
            if (this.elementExists(game, "seriesSummary")) {
              result.specificData.seriesSummary = game.seriesSummary;
            }
            break;
          default:
        }
        await result.save();
      }
    }
  }


  /*
  Update odds for today's games.
  */
  async updateOddsForTodaysGames(sport, league, college) {
    var day = new Date();
    console.log("Updating odds for today's games...");
    const url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
    sport+"&league="+league+college+"&dates="+this.convertDate(day);
    const response = await fetch(url);
    const data = await response.json();
    console.log("Processing data for " + league);

    //if there's "events" today, loop through and update odds for each event
    if (this.elementExists(data.sports[0].leagues[0], "events")) {
      for (const game of data.sports[0].leagues[0].events) {

        let result = await Pregame.findOne({ gameId: game.id });
        if (result) {
          if (this.elementExists(game, "odds")) {

            if (this.elementExists(game.odds, "overUnder")) {
              result.overUnder = game.odds.overUnder;
            }

            if (this.elementExists(game.odds, "spread")) {
              result.spread = Math.abs(game.odds.spread);
            }

            if (this.elementExists(game.odds, "overOdds")) {
              result.overOdds = game.odds.overOdds;
            }

            if (this.elementExists(game.odds, "underOdds")) {
              result.underOdds = game.odds.underOdds;
            }


            if (this.elementExists(game.odds, "awayTeamOdds")) {

              if (this.elementExists(game.odds.awayTeamOdds, "moneyLine")) {
                result.awayML = game.odds.awayTeamOdds.moneyLine;
              }

              if (this.elementExists(game.odds.awayTeamOdds, "favorite") &&
              game.odds.awayTeamOdds.favorite === true) {
                result.favoredTeam = game.odds.awayTeamOdds.team.abbreviation;
                result.favoredTeamId = game.odds.awayTeamOdds.team.id;
              }

              if (this.elementExists(game.odds.awayTeamOdds, "spreadOdds")) {
                result.awaySpreadOdds = game.odds.awayTeamOdds.spreadOdds;
              }

            }


            if (this.elementExists(game.odds, "homeTeamOdds")) {

              if (this.elementExists(game.odds.homeTeamOdds, "moneyLine")) {
                result.homeML = game.odds.homeTeamOdds.moneyLine;
              }

              if (this.elementExists(game.odds.homeTeamOdds, "favorite") &&
              game.odds.homeTeamOdds.favorite === true) {
                result.favoredTeam = game.odds.homeTeamOdds.team.abbreviation;
                result.favoredTeamId = game.odds.homeTeamOdds.team.id;
              }

              if (this.elementExists(game.odds.homeTeamOdds, "spreadOdds")) {
                result.homeSpreadOdds = game.odds.homeTeamOdds.spreadOdds;
              }

            }

            if (result.sport === "soccer" && this.elementExists(game.odds, "drawOdds")) {
              if (this.elementExists(game.odds.drawOdds, "moneyLine")) {
                result.drawML = game.odds.drawOdds.moneyLine;
              }
            }

          }
          await result.save();
        }
      }
    }
  }


  /*
  Helper function for addUpcomingGames(), gets called for each day.
  */
  async addGamesForDay(data, sport, league) {
    for (const game of data) {
      const gameExists = await Pregame.exists({ gameId: game.id });
      if (gameExists === false) {
        console.log("Adding new upcoming game...");

        //adding default data
        const contents = {
          gameId: game.id,
          state: game.status,
          stateDetails: game.fullStatus.type.name,
          sport: sport,
          league: league,
          homeId: parseInt(game.competitors[0].id),
          awayId: parseInt(game.competitors[1].id),
          homeLogo: game.competitors[0].logo,
          awayLogo: game.competitors[1].logo,
          homeAbbreviation: game.competitors[0].abbreviation,
          awayAbbreviation: game.competitors[1].abbreviation,
          homeFullName: game.competitors[0].displayName,
          awayFullName: game.competitors[1].displayName,
          homeColor: game.competitors[0].color,
          awayColor: game.competitors[1].color,
          homeRecord: "0-0",
          awayRecord: "0-0",
          startTime: game.date,
          spread: -1,
          homeSpreadOdds: 0,
          awaySpreadOdds: 0,
          favoredTeamId: 0,
          favoredTeam: "",
          overUnder: -1,
          overOdds: 0,
          underOdds: 0,
          homeML: 0,
          awayML: 0,
          drawML: 0,
          playByPlayAvailable: game.playByPlayAvailable,
          location: game.location,
          specificData: {},
        };

        if (this.elementExists(game, "broadcasts")) {
          if (game.broadcasts.length > 0) {
            let myBroadcasts = []
            for (const broadcast of game.broadcasts) {
              myBroadcasts.push(broadcast.name);
            }
            contents.broadcasts = myBroadcasts;
          }
        }
        if (this.elementExists(game.competitors[0], "record")) {
          if (sport === "hockey") {
            contents.homeRecord = game.competitors[0].shortenedRecord;
          }
          else { contents.homeRecord = game.competitors[0].record; }
        }
        if (this.elementExists(game.competitors[1], "record")) {
          if (sport === "hockey") {
            contents.awayRecord= game.competitors[1].shortenedRecord;
          }
          else { contents.awayRecord = game.competitors[1].record; }
        }


        //odds
        if (this.elementExists(game, "odds")) {

          if (this.elementExists(game.odds, "overUnder")) {
            contents.overUnder = game.odds.overUnder;
          }

          if (this.elementExists(game.odds, "spread")) {
            contents.spread = Math.abs(game.odds.spread);
          }

          if (this.elementExists(game.odds, "overOdds")) {
            contents.overOdds = game.odds.overOdds;
          }

          if (this.elementExists(game.odds, "underOdds")) {
            contents.underOdds = game.odds.underOdds;
          }



          if (this.elementExists(game.odds, "awayTeamOdds")) {

            if (this.elementExists(game.odds.awayTeamOdds, "moneyLine")) {
              contents.awayML = game.odds.awayTeamOdds.moneyLine;
            }

            if (this.elementExists(game.odds.awayTeamOdds, "favorite") &&
                game.odds.awayTeamOdds.favorite === true) {
              contents.favoredTeam = game.odds.awayTeamOdds.team.abbreviation;
              contents.favoredTeamId = game.odds.awayTeamOdds.team.id;
            }

            if (this.elementExists(game.odds.awayTeamOdds, "spreadOdds")) {
              contents.awaySpreadOdds = game.odds.awayTeamOdds.spreadOdds;
            }

          }



          if (this.elementExists(game.odds, "homeTeamOdds")) {

            if (this.elementExists(game.odds.homeTeamOdds, "moneyLine")) {
              contents.homeML = game.odds.homeTeamOdds.moneyLine;
            }

            if (this.elementExists(game.odds.homeTeamOdds, "favorite") &&
                game.odds.homeTeamOdds.favorite === true) {
              contents.favoredTeam = game.odds.homeTeamOdds.team.abbreviation;
              contents.favoredTeamId = game.odds.homeTeamOdds.team.id;
            }

            if (this.elementExists(game.odds.homeTeamOdds, "spreadOdds")) {
              contents.homeSpreadOdds = game.odds.homeTeamOdds.spreadOdds;
            }

          }

          if (sport === "soccer" && this.elementExists(game.odds, "drawOdds")) {

            if (this.elementExists(game.odds.drawOdds, "moneyLine")) {
              contents.drawML = game.odds.drawOdds.moneyLine;
            }
          }

        }

        //adding league-specific data
        switch (league) {
          case "college-football":
          case "mens-college-basketball":
            contents.specificData.homeRank = -1;
            contents.specificData.awayRank = -1;
            if (this.elementExists(game.competitors[0], "rank")) {
              contents.specificData.homeRank = game.competitors[0].rank;
            }
            if (this.elementExists(game.competitors[1], "rank")) {
              contents.specificData.awayRank = game.competitors[1].rank;
            }
            break;
          case "nhl":
            if (this.elementExists(game, "seriesSummary")) {
              contents.specificData.seriesSummary = game.seriesSummary;
            }
            break;
          default:
        }

        //saving to DB
        let g = new Pregame(contents);
        g.save();
      }
    }
  }


  /*
  Process live game data and check if any games have ended.
  */
  async processData(sport, league, college) {

    var day = new Date();
    const url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
    sport+"&league="+league+college;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Processing data for "+league);

    const games_in = [];
    const games_post = [];
    const myData = data.sports[0].leagues[0].events

    if (myData) {
      myData.forEach((game) => {
        const gameState = game.status;
        if (gameState === "in") games_in.push(game);
        if (gameState === "post") games_post.push(game);
      });
    }

    if (games_in.length > 0) {
      this.updateLivegames(games_in, sport, league);
    }

    if (games_post.length > 0) {
      this.updatePostgames(games_post, sport, league);
    }
  }


  /*
  Update live games.
  */
  async updateLivegames(games, sport, league) {
    for (const game of games) {
      const gameExists = await Livegame.exists({ gameId: game.id });
      const gameWasInPregame = await Pregame.exists({ gameId: game.id });

      //case 1 - game needs to be added to DB
      if (gameExists === false && gameWasInPregame === true) {
        console.log("Adding new live game...");

        //adding default data
        const contents = {
          gameId: game.id,
          state: game.status,
          stateDetails: game.fullStatus.type.name,
          sport: sport,
          league: league,
          homeId: parseInt(game.competitors[0].id),
          awayId: parseInt(game.competitors[1].id),
          homeLogo: game.competitors[0].logo,
          awayLogo: game.competitors[1].logo,
          homeScore: parseInt(game.competitors[0].score),
          awayScore: parseInt(game.competitors[1].score),
          homeAbbreviation: game.competitors[0].abbreviation,
          awayAbbreviation: game.competitors[1].abbreviation,
          homeFullName: game.competitors[0].displayName,
          awayFullName: game.competitors[1].displayName,
          homeColor: game.competitors[0].color,
          awayColor: game.competitors[1].color,
          homeRecord: "0-0",
          awayRecord: "0-0",
          startTime: game.date,
          spread: -1,
          homeSpreadOdds: 0,
          awaySpreadOdds: 0,
          favoredTeamId: 0,
          favoredTeam: "",
          overUnder: -1,
          overOdds: 0,
          underOdds: 0,
          homeML: 0,
          awayML: 0,
          playByPlayAvailable: game.playByPlayAvailable,
          location: game.location,
          time: game.clock,
          period: game.period,
          lastPlay: "",
          specificData: {},
        };


        if (this.elementExists(game, "broadcasts")) {
          if (game.broadcasts.length > 0) {
            let myBroadcasts = []
            for (const broadcast of game.broadcasts) {
              myBroadcasts.push(broadcast.name);
            }
            contents.broadcasts = myBroadcasts;
          }
        }
        if (this.elementExists(game.competitors[0], "record")) {
          if (sport === "hockey") {
            contents.homeRecord = game.competitors[0].shortenedRecord;
          }
          else { contents.homeRecord = game.competitors[0].record; }
        }
        if (this.elementExists(game.competitors[1], "record")) {
          if (sport === "hockey") {
            contents.awayRecord = game.competitors[1].shortenedRecord;
          }
          else { contents.awayRecord = game.competitors[1].record; }
        }


        //odds
        if (this.elementExists(game, "odds")) {

          if (this.elementExists(game.odds, "overUnder")) {
            contents.overUnder = game.odds.overUnder;
          }

          if (this.elementExists(game.odds, "spread")) {
            contents.spread = Math.abs(game.odds.spread);
          }

          if (this.elementExists(game.odds, "overOdds")) {
            contents.overOdds = game.odds.overOdds;
          }

          if (this.elementExists(game.odds, "underOdds")) {
            contents.underOdds = game.odds.underOdds;
          }



          if (this.elementExists(game.odds, "awayTeamOdds")) {

            if (this.elementExists(game.odds.awayTeamOdds, "moneyLine")) {
              contents.awayML = game.odds.awayTeamOdds.moneyLine;
            }

            if (this.elementExists(game.odds.awayTeamOdds, "favorite") &&
                game.odds.awayTeamOdds.favorite === true) {
              contents.favoredTeam = game.odds.awayTeamOdds.team.abbreviation;
              contents.favoredTeamId = game.odds.awayTeamOdds.team.id;
            }

            if (this.elementExists(game.odds.awayTeamOdds, "spreadOdds")) {
              contents.awaySpreadOdds = game.odds.awayTeamOdds.spreadOdds;
            }

          }



          if (this.elementExists(game.odds, "homeTeamOdds")) {

            if (this.elementExists(game.odds.homeTeamOdds, "moneyLine")) {
              contents.homeML = game.odds.homeTeamOdds.moneyLine;
            }

            if (this.elementExists(game.odds.homeTeamOdds, "favorite") &&
                game.odds.homeTeamOdds.favorite === true) {
              contents.favoredTeam = game.odds.homeTeamOdds.team.abbreviation;
              contents.favoredTeamId = game.odds.homeTeamOdds.team.id;
            }

            if (this.elementExists(game.odds.homeTeamOdds, "spreadOdds")) {
              contents.homeSpreadOdds = game.odds.homeTeamOdds.spreadOdds;
            }

          }
        }


        if (this.elementExists(game.situation, "lastPlay")) {
          contents.lastPlay = game.situation.lastPlay.text;
        }


        //adding league-specific data
        switch (sport) {
          case "football":

            if (league === "college-football") {
              // contents.specificData.homeRank =
              //   game.competitions[0].competitors[0].curatedRank.current;
              // contents.specificData.awayRank =
              //   game.competitions[0].competitors[1].curatedRank.current;
            }
            // contents.specificData.down = game.competitions[0].situation.down;
            // contents.specificData.distance =
            //   game.competitions[0].situation.distance;
            // contents.specificData.yardLine =
            //   game.competitions[0].situation.yardLine;
            // contents.specificData.isRedZone =
            //   game.competitions[0].situation.isRedZone;
            // contents.specificData.possession = possessionTeam;
            break;
          case "basketball":
            if (league === "mens-college-basketball") {
              contents.specificData.homeRank = -1;
              contents.specificData.awayRank = -1;
              if (this.elementExists(game.competitors[0], "rank")) {
                contents.specificData.homeRank = game.competitors[0].rank;
              }
              if (this.elementExists(game.competitors[1], "rank")) {
                contents.specificData.awayRank = game.competitors[1].rank;
              }
            }
            contents.specificData.possession = "";
            if (this.elementExists(game.situation, "lastPlay") &&
            this.elementExists(game.situation.lastPlay, "team")) {
              contents.specificData.possession = game.situation.lastPlay.team.id;
            }
            break;
          case "soccer":
            contents.specificData.possession = "";
            if (this.elementExists(game.situation, "lastPlay") &&
            this.elementExists(game.situation.lastPlay, "team")) {
              contents.specificData.possession = game.situation.lastPlay.team.id;
            }
            contents.specificData.addedClock = game.addedClock;
            break;
          case "hockey":
            contents.specificData.possession = "";
            if (this.elementExists(game.situation, "lastPlay") &&
            this.elementExists(game.situation.lastPlay, "team")) {
              contents.specificData.possession = game.situation.lastPlay.team.id;
            }
            break;
          default:
        }

        //saving to DB
        let g = new Livegame(contents);
        g.save();


        //if this is a top event, we should update the game state
        const isTopEvent = await TopEvent.exists({ gameId: game.id });
        if (isTopEvent === true) {
          console.log("Updating game state for top event...");
          TopEvent.findOneAndUpdate(
            { gameId: game.id },
            {
              gameState: "in",
            },
            (err, result) => {
              if (err) console.log(err);
            }
          );
        }

        //deleting entry from pregames DB
        Pregame.findOneAndDelete({ gameId: game.id }, (err, result) => {
          console.log("Deleting from pregame...");
          if (err) {
            console.log(err);
          }
        });
      }

      //case 2 - update the livegame (only update games that are in progress)
      else if (game.fullStatus.type.name === "STATUS_IN_PROGRESS") {
        console.log("Updating existing game...");

        //first, update the live game entry
        const existingGame = await Livegame.findOne({ gameId: game.id });
        switch (sport) {
          case "football":
            // existingGame.homeScore = parseInt(game.competitors[0].score);
            // existingGame.awayScore = parseInt(game.competitions[0].competitors[1].score);
            // existingGame.time = game.clock;
            // existingGame.period = game.period;
            // if (this.elementExists(game.situation, "lastPlay")) {
            //   existingGame.lastPlay = game.situation.lastPlay.text;
            // }
            // existingGame.specificData = {
            //   down: game.competitions[0].situation.down,
            //   distance: game.competitions[0].situation.distance,
            //   yardLine: game.competitions[0].situation.yardLine,
            //   isRedZone: game.competitions[0].situation.isRedZone,
            //   possession: possessionTeam,
            // };
            await existingGame.save();
            break;
          case "basketball":
            if (existingGame) {
              existingGame.homeScore = 0;
              if (this.elementExists(game.competitors[0], "score")) {
                existingGame.homeScore = parseInt(game.competitors[0].score);
              }
              existingGame.awayScore = 0;
              if (this.elementExists(game.competitors[1], "score")) {
                existingGame.awayScore = parseInt(game.competitors[1].score);
              }
              existingGame.time = game.clock;
              existingGame.period = game.period;
              if (this.elementExists(game.situation, "lastPlay")) {
                existingGame.lastPlay = game.situation.lastPlay.text;
                if (this.elementExists(game.situation.lastPlay, "team")) {
                  existingGame.specificData = {
                    possession: game.situation.lastPlay.team.id,
                  };
                }
              }
              await existingGame.save();
            }
            break;
          case "soccer":
            if (existingGame) {
              existingGame.homeScore = 0;
              if (this.elementExists(game.competitors[0], "score")) {
                existingGame.homeScore = parseInt(game.competitors[0].score);
              }
              existingGame.awayScore = 0;
              if (this.elementExists(game.competitors[1], "score")) {
                existingGame.awayScore = parseInt(game.competitors[1].score);
              }
              existingGame.time = game.clock;
              existingGame.period = game.period;
              if (this.elementExists(game.situation, "lastPlay")) {
                existingGame.lastPlay = game.situation.lastPlay.text;
                if (this.elementExists(game.situation.lastPlay, "team")) {
                  existingGame.specificData = {
                    possession: game.situation.lastPlay.team.id,
                    addedClock: game.addedClock
                  };
                }
              }
              await existingGame.save();
            }
            break;
          case "hockey":
            if (existingGame) {
              existingGame.homeScore = 0;
              if (this.elementExists(game.competitors[0], "score")) {
                existingGame.homeScore = parseInt(game.competitors[0].score);
              }
              existingGame.awayScore = 0;
              if (this.elementExists(game.competitors[1], "score")) {
                existingGame.awayScore = parseInt(game.competitors[1].score);
              }
              existingGame.time = game.clock;
              existingGame.period = game.period;
              if (this.elementExists(game.situation, "lastPlay")) {
                existingGame.lastPlay = game.situation.lastPlay.text;
                if (this.elementExists(game.situation.lastPlay, "team")) {
                  existingGame.specificData = {
                    possession: game.situation.lastPlay.team.id,
                  };
                }
              }
              await existingGame.save();
            }
            break;
        }


        //if a lastPlay exists, look to see if it's been logged in the DB
        if (this.elementExists(game.situation, "lastPlay")) {
          const playExists = await Play.exists({
            playId: game.situation.lastPlay.id,
          });
          if (playExists === false) {
            console.log("Adding new play...");

            //add default data
            const playData = {
              playId: game.situation.lastPlay.id,
              description: game.situation.lastPlay.text,
              scoreValue: game.situation.lastPlay.scoreValue,
              gameId: game.id,
              createdAt: new Date().toISOString(),
              specificData: {},
            };

            let possession = "";
            if (this.elementExists(game.situation.lastPlay, "team")) {
              possession = game.situation.lastPlay.team.id
            }

            //add league-specific data
            switch (league) {
              case "nfl":
                // playData.specificData = {
                //   homeScore: parseInt(
                //     game.competitions[0].competitors[0].score
                //   ),
                //   awayScore: parseInt(
                //     game.competitions[0].competitors[1].score
                //   ),
                //   time: game.competitions[0].status.displayClock,
                //   quarter: game.competitions[0].status.period,
                //   down: game.competitions[0].situation.down,
                //   distance: game.competitions[0].situation.distance,
                //   yardLine: game.competitions[0].situation.yardLine,
                //   possession: possessionTeam,
                // };
                break;
              case "college-football":
                // playData.specificData = {
                //   homeScore: parseInt(
                //     game.competitions[0].competitors[0].score
                //   ),
                //   awayScore: parseInt(
                //     game.competitions[0].competitors[1].score
                //   ),
                //   time: game.competitions[0].status.displayClock,
                //   quarter: game.competitions[0].status.period,
                //   down: game.competitions[0].situation.down,
                //   distance: game.competitions[0].situation.distance,
                //   yardLine: game.competitions[0].situation.yardLine,
                //   possession: possessionTeam,
                // };
                break;

              //live test to add more logic to this
              case "mens-college-basketball":
                playData.specificData = {
                  homeScore: parseInt(game.competitors[0].score),
                  awayScore: parseInt(game.competitors[1].score),
                  time: game.clock,
                  half: game.period,
                  possession: possession,
                };
                break;
              case "nba":
                playData.specificData = {
                  homeScore: parseInt(game.competitors[0].score),
                  awayScore: parseInt(game.competitors[1].score),
                  time: game.clock,
                  quarter: game.period,
                  possession: possession,
                };
                break;
              case "eng.1":
              case "usa.1":
              case "uefa.champions":
                playData.specificData = {
                  homeScore: parseInt(game.competitors[0].score),
                  awayScore: parseInt(game.competitors[1].score),
                  time: game.clock,
                  half: game.period,
                  possession: possession,
                };
                break;
              case "nhl":
                playData.specificData = {
                  homeScore: parseInt(game.competitors[0].score),
                  awayScore: parseInt(game.competitors[1].score),
                  time: game.clock,
                  period: game.period,
                  possession: possession,
                };
                break;
              default:
            }

            //saving to DB
            let currentPlay = new Play(playData);
            currentPlay.save();
          }
        }
      }
    }
  }



  /*
  Check if any games were completed and add them to the postgame DB.
  */
  async updatePostgames(games, sport, league) {
    for (const game of games) {
      if (game.fullStatus.type.name === "STATUS_CANCELED" ||
          game.fullStatus.type.name === "STATUS_POSTPONED") {
        const pregameExists = await Pregame.exists({ gameId: game.id });
        if (pregameExists === true) {
          console.log("Game was cancelled / postponed, removing from pregames...");
          Pregame.findOneAndDelete({ gameId: game.id }, (err, result) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }

      else {
        const gameExists = await Postgame.exists({ gameId: game.id });
        const gameWasInLive = await Livegame.exists({ gameId: game.id });
        if (gameExists === false && gameWasInLive === true) {
          console.log("Adding completed game...");

          //add default data
          const contents = {
            gameId: game.id,
            state: game.status,
            stateDetails: game.fullStatus.type.name,
            sport: sport,
            league: league,
            homeId: parseInt(game.competitors[0].id),
            awayId: parseInt(game.competitors[1].id),
            homeLogo: game.competitors[0].logo,
            awayLogo: game.competitors[1].logo,
            homeScore: game.competitors[0].score,
            awayScore: game.competitors[1].score,
            homeAbbreviation: game.competitors[0].abbreviation,
            awayAbbreviation: game.competitors[1].abbreviation,
            homeFullName: game.competitors[0].displayName,
            awayFullName: game.competitors[1].displayName,
            homeColor: game.competitors[0].color,
            awayColor: game.competitors[1].color,
            homeRecord: "0-0",
            awayRecord: "0-0",
            spread: -1,
            homeSpreadOdds: 0,
            awaySpreadOdds: 0,
            favoredTeamId: 0,
            favoredTeam: "",
            overUnder: -1,
            overOdds: 0,
            underOdds: 0,
            homeML: 0,
            awayML: 0,
            drawML: 0,
            spreadWinner: "P",
            ouResult: "P",
            specificData: {},
          };

          if (this.elementExists(game.competitors[0], "record")) {
            if (sport === "hockey") {
              contents.homeRecord = game.competitors[0].shortenedRecord;
            }
            else { contents.homeRecord = game.competitors[0].record; }
          }
          if (this.elementExists(game.competitors[1], "record")) {
            if (sport === "hockey") {
              contents.awayRecord = game.competitors[1].shortenedRecord;
            }
            else { contents.awayRecord = game.competitors[1].record; }
          }

          let result = await Livegame.findOne({ gameId: game.id });
          if (result) {
            contents.spread = result.spread;
            contents.homeSpreadOdds = result.homeSpreadOdds;
            contents.awaySpreadOdds = result.awaySpreadOdds;
            contents.favoredTeamId = result.favoredTeamId;
            contents.favoredTeam = result.favoredTeam;
            contents.overUnder = result.overUnder;
            contents.overOdds = result.overOdds;
            contents.underOdds = result.underOdds;
            contents.homeML = result.homeML;
            contents.awayML = result.awayML;

            if (result.spread !== -1) {
              contents.spreadWinner = this.calculateSpreadWinner(
                parseInt(game.competitors[0].score),
                parseInt(game.competitors[1].score),
                game.competitors[0].abbreviation,
                game.competitors[1].abbreviation,
                result.favoredTeam,
                result.spread
              );
            }
            if (result.overUnder !== -1) {
              contents.ouResult = this.calculateOuResult(
                parseInt(game.competitors[0].score) +
                  parseInt(game.competitors[1].score),
                result.overUnder
              );
            }
          }

          //add league-specific data
          switch (league) {
            case "college-football":
            case "mens-college-basketball":
              contents.specificData.homeRank = -1;
              contents.specificData.awayRank = -1;
              if (this.elementExists(game.competitors[0], "rank")) {
                contents.specificData.homeRank = game.competitors[0].rank;
              }
              if (this.elementExists(game.competitors[1], "rank")) {
                contents.specificData.awayRank = game.competitors[1].rank;
              }
              break;
            default:
              contents.specificData = {};
          }

          //saving to DB
          let g = new Postgame(contents);
          g.save();

          //if this was a top event, we should remove it from the TopEvent collection
          const isTopEvent = await TopEvent.exists({ gameId: game.id });
          if (isTopEvent === true) {
            console.log("Removing from top events...");
            TopEvent.findOneAndDelete({ gameId: game.id }, (err, result) => {
              if (err) {
                console.log(err);
              }
            });
          }

          //deleting entry from livegames DB
          Livegame.findOneAndDelete({ gameId: game.id }, (err, result) => {
            console.log("Deleting from livegame...");
            if (err) {
              console.log(err);
            }
          });

        }
      }
    }
  }
}

module.exports = {
  GameService: GameService,
};
