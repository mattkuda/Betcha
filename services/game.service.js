
/*
Updates games within our database, making use of the ESPN API to obtain information about each game.
*/


//import mongoose models
const Pregame = require('../models/Pregame');
const Livegame = require('../models/Livegame');
const Postgame = require('../models/Postgame');
const Play = require('../models/Play');

//import libraries
const fetch = require('node-fetch');


class GameService {




  constructor() {
    this.ctr = 1;

    //in-season sports that we care about - eventually, we will get this from "Active Leagues" DB
    this.sport_list = [
      ['football', 'nfl'],
      ['football', 'college-football'],
      ['basketball', 'mens-college-basketball'],
      ['basketball', 'nba']
    ];
  }






  /*
  Checks if an element exists within a JSON file before trying to access it. Used to handle
  potential corner cases when working with the ESPN data.
  */
  elementExists(prop_parent, prop) {
    return prop_parent.hasOwnProperty(prop);
  }






  /*
  Function to determine which team covered the spread.
  */
  calculateSpreadWinner(homeScore, awayScore, homeAbbreviation, awayAbbreviation, spread) {

    //corner case - checking if the game was a pick-em
    if (spread === "EVEN") {
      if (homeScore > awayScore) { return homeAbbreviation; }
      if (awayScore > homeScore) { return awayAbbreviation; }
      return "P";
    }

    const parseSpread = spread.split(" ");
    const favoredTeam = parseSpread[0];
    const favoredAmount = parseFloat(parseSpread[1].substring(1));

    //if home team is favored
    if (favoredTeam === homeAbbreviation) {
      if ((homeScore - awayScore) > favoredAmount) {
        return homeAbbreviation;
      }
      else if ((homeScore - awayScore) < favoredAmount) {
        return awayAbbreviation;
      }
      return "P";
    }

    //if away team is favored
    else if (favoredTeam === awayAbbreviation) {
      if ((awayScore - homeScore) > favoredAmount) {
        return awayAbbreviation;
      }
      else if ((awayScore - homeScore) < favoredAmount) {
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
        }
        else if (awayScore === highestScore) {
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





  /* This is our "main()" function - we call it within the index.js file to start the game service */
  run() {
    this.tick();
    this.timerID = setInterval( () => {
      this.tick();
      if (this.ctr < 20) {
        this.ctr = this.ctr + 1;
      }
      else {
        this.ctr = 1;
      }
    },
      10000
    );
  }






  /* Every x seconds (as of now, x=30) we call this function, which in turn loops through the
  league list and processes the ESPN data for each one */
  async tick() {
    for (const element of this.sport_list) {
      const url = "http://site.api.espn.com/apis/site/v2/sports/"+ element[0] + "/" + element[1] + "/scoreboard";
      const response = await fetch(url);
      const data = await response.json();
      console.log("Processing data for "+element[1]);
      this.processData(data.events, element[0], element[1]);
    }
  }






  /* Used to sort games by their status. In theory, we should be able to process games_pre, games_in,
  and games_post in parallel, as each game type has its own collection within the DB. */
  processData(data, sport, league) {

    const games_pre = []
    const games_in = []
    const games_post = []

    data.forEach(game => {
      const gameState = game.status.type.state;
      if (gameState === 'pre') games_pre.push(game);
      if (gameState === 'in') games_in.push(game);
      if (gameState === 'post') games_post.push(game);
    })

    if (games_pre.length > 0) {
      this.updatePregames(games_pre, sport, league);
    }

    if (games_in.length > 0) {
      this.updateLivegames(games_in, sport, league);
    }

    if (games_post.length > 0) {
      this.updatePostgames(games_post, sport, league);
    }
  }





  /*
  Logic for updating the pregames DB
  */
  async updatePregames(games, sport, league) {
    let updatePregames = new Boolean(this.ctr === 20);
    if (updatePregames == true) { console.log("Updating pregames odds for "+league + " games..."); }
    for (const game of games) {
      const gameExists = await Pregame.exists({ gameId: game.id });

      //case 1 - game needs to be added to DB
      if (gameExists === false) {
        console.log("Adding new upcoming game...")

        //adding default data
        const contents = {
          gameId: game.id,
          state: 'pre',
          stateDetails: game.status.type.name,
          sport: sport,
          league: league,
          homeLogo: game.competitions[0].competitors[0].team.logo,
          awayLogo: game.competitions[0].competitors[1].team.logo,
          homeAbbreviation: game.competitions[0].competitors[0].team.abbreviation,
          awayAbbreviation: game.competitions[0].competitors[1].team.abbreviation,
          homeFullName: game.competitions[0].competitors[0].team.displayName,
          awayFullName: game.competitions[0].competitors[1].team.displayName,
          homeColor: game.competitions[0].competitors[0].team.color,
          awayColor: game.competitions[0].competitors[1].team.color,
          homeRecord: "0-0",
          awayRecord: "0-0",
          startTime: game.date,
          spread: "",
          overUnder: -1,
          specificData: {}
        };
        if (game.competitions[0].broadcasts.length > 0) {
          contents.broadcasts = game.competitions[0].broadcasts[0].names
        }
        if (this.elementExists(game.competitions[0].competitors[0], "records")) {
          contents.homeRecord = game.competitions[0].competitors[0].records[0].summary;
        }
        if (this.elementExists(game.competitions[0].competitors[1], "records")) {
          contents.awayRecord = game.competitions[0].competitors[1].records[0].summary;
        }
        if (this.elementExists(game.competitions[0], "odds")) {
          contents.spread = game.competitions[0].odds[0].details;
          contents.overUnder = parseFloat(game.competitions[0].odds[0].overUnder);
        }

        //adding league-specific data
        switch(league) {
          case 'nfl':
            if (this.elementExists(game, "weather")) {
              contents.specificData.weatherDescription = game.weather.displayValue;
            }
            break;
          case 'college-football':
            if (this.elementExists(game, "weather")) {
              contents.specificData.weatherDescription = game.weather.displayValue;
            }
            contents.specificData.homeRank = game.competitions[0].competitors[0].curatedRank.current;
            contents.specificData.awayRank = game.competitions[0].competitors[1].curatedRank.current;
            break;
          case 'mens-college-basketball':
            contents.specificData.homeRank = game.competitions[0].competitors[0].curatedRank.current;
            contents.specificData.awayRank = game.competitions[0].competitors[1].curatedRank.current;
            break;
          default:
        }

        //saving to DB
        let g = new Pregame( contents );
        g.save();
      }

      //case 2 - game already exists within DB, check for updates
      else {
        if (updatePregames == true && this.elementExists(game.competitions[0], "odds")) {
          Pregame.findOneAndUpdate({ gameId: game.id }, {
            spread: game.competitions[0].odds[0].details,
            overUnder: parseFloat(game.competitions[0].odds[0].overUnder)
          }, (err, result) => {
            if (err) console.log(err);
          });
        }
      }
    }
  }





  /*
  Logic for updating the livegames DB
  */
  async updateLivegames(games, sport, league) {
    for (const game of games) {
      let possessionTeam = "";
      //check if home team has possession
      if (this.elementExists(game.competitions[0].situation, "lastPlay") && this.elementExists(game.competitions[0].situation.lastPlay, "team")) {
        if (game.competitions[0].situation.lastPlay.team.id === game.competitions[0].competitors[0].id) {
          possessionTeam = game.competitions[0].competitors[0].team.abbreviation;
        }
        if (game.competitions[0].situation.lastPlay.team.id === game.competitions[0].competitors[1].id) {
          possessionTeam = game.competitions[0].competitors[1].team.abbreviation;
        }
      }
      const gameExists = await Livegame.exists({ gameId: game.id });
      const gameWasInPregame = await Pregame.exists({gameId: game.id});

      //case 1 - game needs to be added to DB
      if (gameExists === false && gameWasInPregame === true) {
        console.log("Adding new live game...")

        //adding default data
        const contents = {
          gameId: game.id,
          state: 'in',
          stateDetails: game.status.type.name,
          sport: sport,
          league: league,
          homeLogo: game.competitions[0].competitors[0].team.logo,
          awayLogo: game.competitions[0].competitors[1].team.logo,
          homeScore: 0,
          awayScore: 0,
          homeAbbreviation: game.competitions[0].competitors[0].team.abbreviation,
          awayAbbreviation: game.competitions[0].competitors[1].team.abbreviation,
          homeFullName: game.competitions[0].competitors[0].team.displayName,
          awayFullName: game.competitions[0].competitors[1].team.displayName,
          homeColor: game.competitions[0].competitors[0].team.color,
          awayColor: game.competitions[0].competitors[1].team.color,
          homeRecord: "0-0",
          awayRecord: "0-0",
          startTime: game.date,
          time: game.competitions[0].status.displayClock,
          period: game.competitions[0].status.period,
          spread: "",
          overUnder: -1,
          lastPlay: "",
          specificData: {}
        };
        if (game.competitions[0].broadcasts.length > 0) {
          contents.broadcasts = game.competitions[0].broadcasts[0].names
        }
        if (this.elementExists(game.competitions[0].competitors[0], "records")) {
          contents.homeRecord = game.competitions[0].competitors[0].records[0].summary;
        }
        if (this.elementExists(game.competitions[0].competitors[1], "records")) {
          contents.awayRecord = game.competitions[0].competitors[1].records[0].summary;
        }
        if (this.elementExists(game.competitions[0].situation, "lastPlay")) {
          contents.lastPlay = game.competitions[0].situation.lastPlay.text
        }
        let result = await Pregame.findOne({ gameId: game.id });
        if (result) {
          contents.spread = result.spread;
          contents.overUnder = result.overUnder;
        }

        //adding league-specific data
        switch(league) {
          case 'nfl':
            contents.specificData.down = game.competitions[0].situation.down;
            contents.specificData.distance = game.competitions[0].situation.distance;
            contents.specificData.yardLine = game.competitions[0].situation.yardLine;
            contents.specificData.isRedZone = game.competitions[0].situation.isRedZone;
            contents.specificData.possession = possessionTeam;
            break;
          case 'college-football':
            contents.specificData.homeRank = game.competitions[0].competitors[0].curatedRank.current;
            contents.specificData.awayRank = game.competitions[0].competitors[1].curatedRank.current;
            contents.specificData.down = game.competitions[0].situation.down;
            contents.specificData.distance = game.competitions[0].situation.distance;
            contents.specificData.yardLine = game.competitions[0].situation.yardLine;
            contents.specificData.isRedZone = game.competitions[0].situation.isRedZone;
            contents.specificData.possession = possessionTeam;
            break;
          case 'mens-college-basketball':
            contents.specificData.homeRank = game.competitions[0].competitors[0].curatedRank.current;
            contents.specificData.awayRank = game.competitions[0].competitors[1].curatedRank.current;
            contents.specificData.possession = possessionTeam;
            break;
          case 'nba':
            contents.specificData.possession = possessionTeam;
            break;
          default:
        }

        //saving to DB
        let g = new Livegame( contents );
        g.save();

        //deleting entry from pregames DB
        Pregame.findOneAndDelete({ gameId: game.id }, (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }

      //case 2 - update the livegame (only update games that are in progress)
      else if (game.status.type.name === "STATUS_IN_PROGRESS") {
        console.log("Updating existing game...")

        //first, update the live game entry
        const existingGame = await Livegame.findOne({ gameId: game.id });
        switch(league) {
          case 'nfl':
            existingGame.homeScore = parseInt(game.competitions[0].competitors[0].score);
            existingGame.awayScore = parseInt(game.competitions[0].competitors[1].score);
            existingGame.time = game.competitions[0].status.displayClock;
            existingGame.period = game.competitions[0].status.period;
            if (this.elementExists(game.competitions[0].situation, "lastPlay")) {
              existingGame.lastPlay = game.competitions[0].situation.lastPlay.text
            }
            existingGame.specificData = {
              down: game.competitions[0].situation.down,
              distance: game.competitions[0].situation.distance,
              yardLine: game.competitions[0].situation.yardLine,
              isRedZone: game.competitions[0].situation.isRedZone,
              possession: possessionTeam
            }
            await existingGame.save();
            break;
          case 'college-football':
            existingGame.homeScore = parseInt(game.competitions[0].competitors[0].score);
            existingGame.awayScore = parseInt(game.competitions[0].competitors[1].score);
            existingGame.time = game.competitions[0].status.displayClock;
            existingGame.period = game.competitions[0].status.period;
            if (this.elementExists(game.competitions[0].situation, "lastPlay")) {
              existingGame.lastPlay = game.competitions[0].situation.lastPlay.text
            }
            existingGame.specificData = {
              homeRank: game.competitions[0].competitors[0].curatedRank.current,
              awayRank: game.competitions[0].competitors[1].curatedRank.current,
              down: game.competitions[0].situation.down,
              distance: game.competitions[0].situation.distance,
              yardLine: game.competitions[0].situation.yardLine,
              isRedZone: game.competitions[0].situation.isRedZone,
              possession: possessionTeam
            }
            await existingGame.save();
            break;
          case 'mens-college-basketball':
            existingGame.homeScore = parseInt(game.competitions[0].competitors[0].score);
            existingGame.awayScore = parseInt(game.competitions[0].competitors[1].score);
            existingGame.time = game.competitions[0].status.displayClock;
            existingGame.period = game.competitions[0].status.period;
            if (this.elementExists(game.competitions[0].situation, "lastPlay")) {
              existingGame.lastPlay = game.competitions[0].situation.lastPlay.text
            }
            existingGame.specificData = {
              homeRank: game.competitions[0].competitors[0].curatedRank.current,
              awayRank: game.competitions[0].competitors[1].curatedRank.current,
              possession: possessionTeam
            }
            await existingGame.save();
            break;
          case 'nba':
            existingGame.homeScore = parseInt(game.competitions[0].competitors[0].score);
            existingGame.awayScore = parseInt(game.competitions[0].competitors[1].score);
            existingGame.time = game.competitions[0].status.displayClock;
            existingGame.period = game.competitions[0].status.period;
            if (this.elementExists(game.competitions[0].situation, "lastPlay")) {
              existingGame.lastPlay = game.competitions[0].situation.lastPlay.text
            }
            existingGame.specificData = {
              possession: possessionTeam
            }
            await existingGame.save();
            break;
        }

        //if a lastPlay exists, look to see if it's been logged in the DB
        if (this.elementExists(game.competitions[0].situation, "lastPlay")) {
          const playExists = await Play.exists({ playId: game.competitions[0].situation.lastPlay.id });
          if (playExists === false) {
            console.log("Adding new play...");

            //add default data
            const playData = {
              playId: game.competitions[0].situation.lastPlay.id,
              description: game.competitions[0].situation.lastPlay.text,
              gameId: game.id,
              createdAt: new Date().toISOString(),
              specificData: {}
            };

            //add league-specific data
            switch(league) {
              case 'nfl':
                playData.specificData = {
                  homeScore: parseInt(game.competitions[0].competitors[0].score),
                  awayScore: parseInt(game.competitions[0].competitors[1].score),
                  time: game.competitions[0].status.displayClock,
                  quarter: game.competitions[0].status.period,
                  down: game.competitions[0].situation.down,
                  distance: game.competitions[0].situation.distance,
                  yardLine: game.competitions[0].situation.yardLine,
                  possession: possessionTeam
                }
                break;
              case 'college-football':
                playData.specificData = {
                  homeScore: parseInt(game.competitions[0].competitors[0].score),
                  awayScore: parseInt(game.competitions[0].competitors[1].score),
                  time: game.competitions[0].status.displayClock,
                  quarter: game.competitions[0].status.period,
                  down: game.competitions[0].situation.down,
                  distance: game.competitions[0].situation.distance,
                  yardLine: game.competitions[0].situation.yardLine,
                  possession: possessionTeam
                }
                break;

              //live test to add more logic to this
              case 'mens-college-basketball':
                playData.specificData = {
                  homeScore: parseInt(game.competitions[0].competitors[0].score),
                  awayScore: parseInt(game.competitions[0].competitors[1].score),
                  time: game.competitions[0].status.displayClock,
                  half: game.competitions[0].status.period,
                  possession: possessionTeam
                }
                break;

              case 'nba':
                playData.specificData = {
                  homeScore: parseInt(game.competitions[0].competitors[0].score),
                  awayScore: parseInt(game.competitions[0].competitors[1].score),
                  time: game.competitions[0].status.displayClock,
                  quarter: game.competitions[0].status.period,
                  possession: possessionTeam
                }
                break;
              default:
            }

            //saving to DB
            let currentPlay = new Play( playData );
            currentPlay.save();
          }
        }
      }
    }
  }


  /*
  Logic for updating the postgames DB
  */
  async updatePostgames(games, sport, league) {
    for (const game of games) {
      const gameExists = await Postgame.exists({ gameId: game.id });
      const gameWasInLive = await Livegame.exists({ gameId: game.id });

      if (gameExists === false && game.status.type.name !== "STATUS_CANCELED" && game.status.type.name !== "STATUS_POSTPONED" && gameWasInLive === true) {
        console.log("Adding completed game...");

        //add default data
        const contents = {
          gameId: game.id,
          state: 'post',
          stateDetails: game.status.type.name,
          sport: sport,
          league: league,
          homeLogo: game.competitions[0].competitors[0].team.logo,
          awayLogo: game.competitions[0].competitors[1].team.logo,
          homeScore: parseInt(game.competitions[0].competitors[0].score),
          awayScore: parseInt(game.competitions[0].competitors[1].score),
          homeAbbreviation: game.competitions[0].competitors[0].team.abbreviation,
          awayAbbreviation: game.competitions[0].competitors[1].team.abbreviation,
          homeFullName: game.competitions[0].competitors[0].team.displayName,
          awayFullName: game.competitions[0].competitors[1].team.displayName,
          homeColor: game.competitions[0].competitors[0].team.color,
          awayColor: game.competitions[0].competitors[1].team.color,
          homeRecord: "0-0",
          awayRecord: "0-0",
          spread: "",
          overUnder: -1,
          spreadWinner: "P",
          ouResult: "P",
          specificData: {}
        };
        if (this.elementExists(game.competitions[0].competitors[0], "records")) {
          contents.homeRecord = game.competitions[0].competitors[0].records[0].summary;
        }
        if (this.elementExists(game.competitions[0].competitors[1], "records")) {
          contents.awayRecord = game.competitions[0].competitors[1].records[0].summary;
        }
        let result = await Livegame.findOne({ gameId: game.id });
        if (result) {
          contents.spread = result.spread;
          contents.overUnder = result.overUnder;
          if (result.spread.length > 0) {
            contents.spreadWinner = this.calculateSpreadWinner(parseInt(game.competitions[0].competitors[0].score), parseInt(game.competitions[0].competitors[1].score), game.competitions[0].competitors[0].team.abbreviation, game.competitions[0].competitors[1].team.abbreviation, result.spread);
          }
          if (result.overUnder !== -1) {
            contents.ouResult = this.calculateOuResult( (parseInt(game.competitions[0].competitors[0].score) + parseInt(game.competitions[0].competitors[1].score) ), result.overUnder);
          }
        }
        let localHomeLines = []
        let localAwayLines = []
        for (const element of game.competitions[0].competitors[0].linescores) {
          localHomeLines.push(element.value);
        }
        for (const element of game.competitions[0].competitors[1].linescores) {
          localAwayLines.push(element.value);
        }
        contents.homeLines = localHomeLines;
        contents.awayLines = localAwayLines;

        //add league-specific data
        switch(league) {
          case 'college-football':
            contents.specificData = {
              homeRank: game.competitions[0].competitors[0].curatedRank.current,
              awayRank: game.competitions[0].competitors[1].curatedRank.current
            };
            break;
          case 'mens-college-basketball':
            contents.specificData = {
              homeRank: game.competitions[0].competitors[0].curatedRank.current,
              awayRank: game.competitions[0].competitors[1].curatedRank.current
            };
            break;
          default:
            contents.specificData = {};
        }

        //saving to DB
        let g = new Postgame( contents );
        g.save();

        //deleting entry from livegames DB
        Livegame.findOneAndDelete({ gameId: game.id }, (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  }
};

module.exports = {
  GameService: GameService
};
