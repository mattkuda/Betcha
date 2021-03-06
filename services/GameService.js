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
const LIVE_TICK_INTERVAL = 10000;   //10 seconds
const TOTAL_PREGAME_DAYS = 16;
const ONE_DAY_IN_MS = 86400000;   //24 hrs
const TODAYS_GAMES_ODDS_UPDATE_INTERVAL = 1800000  //30 mins
const TOP_EVENT_INTERVAL = 3600000  //60 mins
const GENERAL_UPDATE_INTERVAL = 5400000  //2 hrs
const NCAAB_TOURNEY_START_DATE = "2021-03-14"


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
  Checks if a date is equal to the current day.
  */
  isToday(day) {
    const today = new Date();
    return day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear();
  }


  /*
  Determine which team covered the spread.
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
  Determine if the game went over or under.
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
      console.log("ctr = "+this.ctr);
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

      console.log("SPORT: "+sport, ", LEAGUE: "+league);

      //if this is a college sport, make sure we're querying all D1 games
      if (league.indexOf("college") !== -1) {
        const currentDate = new Date();
        if (league === "mens-college-basketball" &&
         currentDate > new Date(NCAAB_TOURNEY_START_DATE)) {
           allCollegeTeams = "&groups=100";
        }
        else {
          allCollegeTeams="&groups=50";
        }
      }

      if (this.ctr === 1) {
        this.addUpcomingGames(sport, league, allCollegeTeams);
      }
      if (this.ctr % (TODAYS_GAMES_ODDS_UPDATE_INTERVAL / LIVE_TICK_INTERVAL) === 0) {
        this.updateOddsForTodaysGames(sport, league, allCollegeTeams);
      }
      if (this.ctr % (GENERAL_UPDATE_INTERVAL / LIVE_TICK_INTERVAL) === 0) {
        this.updateVariableGameInfo(sport, league, allCollegeTeams);
      }
      this.processData(sport, league, allCollegeTeams);   //livegames and postgames
    }
    if (this.ctr % (TOP_EVENT_INTERVAL / LIVE_TICK_INTERVAL) === 0) {
      this.processTopEvents();
    }
  }


  /*
  Used to process the top upcoming events (determined by ESPN) and update the DB accordingly.
  */
  async processTopEvents() {

    const url = "http://site.api.espn.com/apis/v2/scoreboard/header?id=0";
    const response = await fetch(url);
    const data = await response.json();
    console.log("Processing top events...");

    for (const sport of data.sports) {
      for (const league of sport.leagues) {
        for (const game of league.events) {
          console.log(game.name);
          const gameExists = await TopEvent.exists({ gameId: game.id });
          const gameInPregame = await Pregame.exists({ gameId: game.id });
          if (gameExists === false && gameInPregame === true && game.status === "pre") {
            console.log("Adding new top event...");
            let topEvent = new TopEvent({
              gameId: game.id,
              rank: game.priority,
              gameState: game.status
            });
            await topEvent.save();
          }
          else { console.log("Top event already found in DB, moving on..."); }
        }
      }
    }
    console.log("Done with top events!");
  }


  /*
  Add upcoming games for the next 2 weeks.
  */
  async addUpcomingGames(sport, league, college) {
    var day = new Date();
    var next;
    var day_ctr = 1;

    while (day_ctr < TOTAL_PREGAME_DAYS) {
      let url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
      sport+"&league="+league+college+"&dates="+this.convertDate(day)+"&enable=odds";
      if (this.isToday(day)) {
        url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
        sport+"&league="+league+college+"&enable=odds";
      }
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
      sport+"&league="+league+college+"&dates="+this.convertDate(day)+"&enable=odds";
      // if (this.isToday(day)) {
      //   url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
      //   sport+"&league="+league+college+"&enable=odds";
      // }
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

      //assemble updated fields
      let updatedFields = {
        stateDetails: game.fullStatus.type.name,
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
        startTime: game.date,
        playByPlayAvailable: game.playByPlayAvailable,
        location: game.location,
        broadcasts: [],
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
        specificData: {},

      }

      //broadcasts
      if (this.elementExists(game, "broadcasts")) {
        if (game.broadcasts.length > 0) {
          let myBroadcasts = []
          for (const broadcast of game.broadcasts) {
            myBroadcasts.push(broadcast.name);
          }
          updatedFields.broadcasts = myBroadcasts;
        }
      }

      //records
      if (this.elementExists(game.competitors[0], "record")) {
        if (sport === "hockey") {
          updatedFields.homeRecord = game.competitors[0].shortenedRecord;
        }
        else { updatedFields.homeRecord = game.competitors[0].record; }
      }
      if (this.elementExists(game.competitors[1], "record")) {
        if (sport === "hockey") {
          updatedFields.awayRecord= game.competitors[1].shortenedRecord;
        }
        else { updatedFields.awayRecord = game.competitors[1].record; }
      }


      //odds
      if (this.elementExists(game, "odds")) {
        if (this.elementExists(game.odds, "overUnder")) {
          updatedFields.overUnder = game.odds.overUnder;
        }
        if (this.elementExists(game.odds, "spread")) {
          updatedFields.spread = Math.abs(game.odds.spread);
        }
        if (this.elementExists(game.odds, "overOdds")) {
          updatedFields.overOdds = game.odds.overOdds;
        }
        if (this.elementExists(game.odds, "underOdds")) {
          updatedFields.underOdds = game.odds.underOdds;
        }
        if (this.elementExists(game.odds, "awayTeamOdds")) {
          if (this.elementExists(game.odds.awayTeamOdds, "moneyLine")) {
            updatedFields.awayML = game.odds.awayTeamOdds.moneyLine;
          }
          if (this.elementExists(game.odds.awayTeamOdds, "favorite") &&
          game.odds.awayTeamOdds.favorite === true) {
            updatedFields.favoredTeam = game.odds.awayTeamOdds.team.abbreviation;
            updatedFields.favoredTeamId = game.odds.awayTeamOdds.team.id;
          }
          if (this.elementExists(game.odds.awayTeamOdds, "spreadOdds")) {
            updatedFields.awaySpreadOdds = game.odds.awayTeamOdds.spreadOdds;
          }
        }
        if (this.elementExists(game.odds, "homeTeamOdds")) {
          if (this.elementExists(game.odds.homeTeamOdds, "moneyLine")) {
            updatedFields.homeML = game.odds.homeTeamOdds.moneyLine;
          }
          if (this.elementExists(game.odds.homeTeamOdds, "favorite") &&
          game.odds.homeTeamOdds.favorite === true) {
            updatedFields.favoredTeam = game.odds.homeTeamOdds.team.abbreviation;
            updatedFields.favoredTeamId = game.odds.homeTeamOdds.team.id;
          }
          if (this.elementExists(game.odds.homeTeamOdds, "spreadOdds")) {
            updatedFields.homeSpreadOdds = game.odds.homeTeamOdds.spreadOdds;
          }
        }
        if (sport === "soccer" && this.elementExists(game.odds, "drawOdds")) {
          if (this.elementExists(game.odds.drawOdds, "moneyLine")) {
            updatedFields.drawML = game.odds.drawOdds.moneyLine;
          }
        }
      }

      //league-specific data
      switch (league) {
        case "college-football":
        case "mens-college-basketball":
          let rankUpdates = {
            homeRank: -1,
            awayRank: -1,
          };
          if (this.elementExists(game.competitors[0], "rank")) {
            rankUpdates.homeRank = game.competitors[0].rank;
          }
          if (this.elementExists(game.competitors[1], "rank")) {
            rankUpdates.awayRank = game.competitors[1].rank;
          }
          updatedFields.specificData = rankUpdates;
          break;
        default:
      }

      Pregame.findOneAndUpdate({ gameId: game.id }, updatedFields, (err, result) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }


  /*
  Update odds for today's games.
  */
  async updateOddsForTodaysGames(sport, league, college) {
    var day = new Date();
    console.log("Updating odds for today's games...");
    const url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
    sport+"&league="+league+college+"&dates="+this.convertDate(day)+"&enable=odds";
    const response = await fetch(url);
    const data = await response.json();
    console.log("Processing data for " + league+"...");

    //if there's "events" today, loop through and update odds for each event
    if (this.elementExists(data.sports[0].leagues[0], "events")) {
      console.log("Events found for today...");
      for (const game of data.sports[0].leagues[0].events) {
        console.log("Updating odds for "+game.name+"...");

        //assemble updatedOdds
        let updatedOdds = {
          overUnder: -1,
          spread: -1,
          overOdds: 0,
          underOdds: 0,
          awayML: 0,
          awaySpreadOdds: 0,
          homeML: 0,
          homeSpreadOdds: 0,
          favoredTeamId: 0,
          favoredTeam: "",
          drawML: 0,
        }

        if (this.elementExists(game, "odds")) {
          if (this.elementExists(game.odds, "overUnder")) {
            updatedOdds.overUnder = game.odds.overUnder;
          }
          if (this.elementExists(game.odds, "spread")) {
            updatedOdds.spread = Math.abs(game.odds.spread);
          }
          if (this.elementExists(game.odds, "overOdds")) {
            updatedOdds.overOdds = game.odds.overOdds;
          }
          if (this.elementExists(game.odds, "underOdds")) {
            updatedOdds.underOdds = game.odds.underOdds;
          }
          if (this.elementExists(game.odds, "awayTeamOdds")) {
            if (this.elementExists(game.odds.awayTeamOdds, "moneyLine")) {
              updatedOdds.awayML = game.odds.awayTeamOdds.moneyLine;
            }
            if (this.elementExists(game.odds.awayTeamOdds, "favorite") &&
            game.odds.awayTeamOdds.favorite === true) {
              updatedOdds.favoredTeam = game.odds.awayTeamOdds.team.abbreviation;
              updatedOdds.favoredTeamId = game.odds.awayTeamOdds.team.id;
            }
            if (this.elementExists(game.odds.awayTeamOdds, "spreadOdds")) {
              updatedOdds.awaySpreadOdds = game.odds.awayTeamOdds.spreadOdds;
            }
          }
          if (this.elementExists(game.odds, "homeTeamOdds")) {
            if (this.elementExists(game.odds.homeTeamOdds, "moneyLine")) {
              updatedOdds.homeML = game.odds.homeTeamOdds.moneyLine;
            }
            if (this.elementExists(game.odds.homeTeamOdds, "favorite") &&
            game.odds.homeTeamOdds.favorite === true) {
              updatedOdds.favoredTeam = game.odds.homeTeamOdds.team.abbreviation;
              updatedOdds.favoredTeamId = game.odds.homeTeamOdds.team.id;
            }
            if (this.elementExists(game.odds.homeTeamOdds, "spreadOdds")) {
              updatedOdds.homeSpreadOdds = game.odds.homeTeamOdds.spreadOdds;
            }
          }
          if (sport === "soccer" && this.elementExists(game.odds, "drawOdds")) {
            if (this.elementExists(game.odds.drawOdds, "moneyLine")) {
              updatedOdds.drawML = game.odds.drawOdds.moneyLine;
            }
          }
        }

        Pregame.findOneAndUpdate({ gameId: game.id }, updatedOdds, (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  }


  /*
  Helper function for addUpcomingGames(), gets called for each day.
  */
  async addGamesForDay(data, sport, league) {
    for (const game of data) {
      const gameExistsInPregame = await Pregame.exists({ gameId: game.id });
      const gameExistsInLivegame = await Livegame.exists({ gameId: game.id });
      const gameExistsInPostgame = await Postgame.exists({ gameId: game.id });
      if (gameExistsInPregame === false && gameExistsInLivegame === false && gameExistsInPostgame === false && game.status === "pre") {
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
          default:
        }

        //saving to DB
        let g = new Pregame(contents);
        await g.save();
      }
    }
  }


  /*
  Process live game data and check if any games have ended.
  */
  async processData(sport, league, college) {
    const url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport="+
    sport+"&league="+league+college;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Processing data for "+league);

    const games_in = [];
    const games_post = [];
    const myData = data.sports[0].leagues[0].events

    if (myData) {
      for (const game of myData) {
        const gameState = game.status;
        if (gameState === "in") games_in.push(game);
        if (gameState === "post") games_post.push(game);
      }
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
        await g.save();


        //if this is a top event, we should update the game state
        const isTopEvent = await TopEvent.exists({ gameId: game.id });
        if (isTopEvent === true) {
          console.log("Updating game state for top event...");
          const filter = { gameId: game.id };
          const update = { gameState: "in" };
          TopEvent.findOneAndUpdate(filter, update, (err, result) => {
            if (err) {
              console.log(err);
            }
          });
        }

        //deleting entry from pregames DB
        Pregame.findOneAndDelete({ gameId: game.id }, (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }

      //case 2 - update the livegame (only update games that are in progress)
      else {
        const existingGame = await Livegame.findOne({ gameId: game.id });

        if (existingGame) {
          console.log("Updating existing game...");
          existingGame.stateDetails = game.fullStatus.type.name;

          //first, update the live game entry
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
                    existingGame.specificData.possession = game.situation.lastPlay.team.id;
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
                    existingGame.specificData.possession = game.situation.lastPlay.team.id;
                    existingGame.specificData.addedClock = game.addedClock;
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
                    existingGame.specificData.possession = game.situation.lastPlay.team.id;
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
              await currentPlay.save();
            }
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
            createdAt: new Date().toISOString(),
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
          await g.save();

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
