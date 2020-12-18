
/*
Updates games within our database, making use of the ESPN API to obtain information about each game.
*/


//import mongoose models
const Pregame = require('../models/game.pre');
const Livegame = require('../models/game.live');
const Postgame = require('../models/game.post');
const Play = require('../models/Play');

//import libraries
const fetch = require('node-fetch');


/*

TODO:

1a. Change to state: game.status.type.state (pre/in/post) --> DONE

2. Get the addedContents() function written so we can dynamically
add fields to a document based on the sport and league --> DONE - we use a switch case block instead

3. Rethink the ctr functionality for line dancing that may occur.

4. Add betting logic for postgame entries

5. Test this on other sport list entries (not just NFL) --> DONE

6. Look at ways to make this faster...can we reach out to the ESPN API and process
the data in parallel? Or is this something we have to do sequentially? Run speed tests
on different methods to find the best one.

*/


class GameService {
  constructor() {
    this.ctr = 1;

    //in-season sports that we care about - eventually, we will get this from "Active Leagues" DB
    this.sport_list = [
      ['football', 'nfl'],
      ['football', 'college-football'],
      ['basketball', 'mens-college-basketball']
    ];
  }

  /*
  Checks if an element exists within a JSON file before trying to access it. Used to handle
  potential corner cases when working with the ESPN data.
  */
  elementExists(prop_parent, prop) {
    return prop_parent.hasOwnProperty(prop);
  }


  calculateSpreadWinner(homeScore, awayScore, homeAbbreviation, awayAbbreviation, spread) {
    const parseSpread = spread.split(" ");
    const favoredTeam = parseSpread[0];
    const favoredAmount = parseFloat(parseSpread[1]);

    //if home team is favored
    if (favoredTeam === homeAbbreviation) {
      if ((homeScore - awayScore) > spread) {
        return "F";
      }
      else if ((homeScore - awayScore) < spread) {
        return "U";
      }
      return "P";
    }

    //if away team is favored
    else if (favoredTeam === awayAbbreviation) {
      if ((awayScore - homeScore) > spread) {
        return "F";
      }
      else if ((awayScore - homeScore) < spread) {
        return "U";
      }
      return "P";
    }

    //if neither favored
    else {
      if (homeScore - awayScore !== 0) {
        let highestScore = Math.max(homeScore, awayScore);
        if (homeScore === highestScore) {
          return "H";
        }
        else if (awayScore === highestScore) {
          return "A";
        }
        return "P";
      }
    }
  }

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
      if (this.ctr < 120) {
        this.ctr = this.ctr + 1;
      }
      else {
        this.ctr = 1;
      }
    },
      30000
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
      this.pregameLogic(games_pre, sport, league);
    }

    if (games_in.length > 0) {
      this.liveLogic(games_in, sport, league);
    }

    if (games_post.length > 0) {
      this.postgameLogic(games_post, sport, league);
    }
  }


  async pregameLogic(games, sport, league) {

    let updatePregames = new Boolean(this.ctr === 120);

    for (const game of games) {

      const gameExists = await Pregame.exists({ eventId: game.id });

      if (gameExists === false && this.elementExists(game.competitions[0], "odds")) {

        console.log("Adding new upcoming game...")

        const contents = {
          eventId: game.id,
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
          homeRecord: game.competitions[0].competitors[0].records[0].summary,
          awayRecord: game.competitions[0].competitors[1].records[0].summary,
          startTime: game.date,
          spread: game.competitions[0].odds[0].details,
          overUnder: game.competitions[0].odds[0].overUnder
        };

        if (game.competitions[0].broadcasts.length > 0) {
          contents.broadcasts = game.competitions[0].broadcasts[0].names
        }

        switch(league) {
          case 'nfl':

            if (this.elementExists(game, "weather")) {
              contents.specificData = {
                weatherDescription: game.weather.displayValue
                //highTemp: game.weather.temperature
              };
            }

            break;
          case 'college-football':

            if (this.elementExists(game, "weather")) {
              contents.specificData = {
                weatherDescription: game.weather.displayValue
                //highTemp: game.weather.temperature
              };
              contents.specificData.homeRank = game.competitions[0].competitors[0].curatedRank.current;
              contents.specificData.awayRank = game.competitions[0].competitors[1].curatedRank.current;
            }

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

        let g = new Pregame( contents );
        g.save();
      }

      else {

        if (updatePregames && this.elementExists(game.competitions[0], "odds")) {
          Pregame.findOneAndUpdate({ eventId: game.id }, {
            spread: game.competitions[0].odds[0].details,
            overUnder: game.competitions[0].odds[0].overUnder
          }, (err, result) => {
            if (err) console.log(err);
          });
        }
      }
    }
  }


  async liveLogic(games, sport, league) {

    for (const game of games) {

      let possessionTeam = "";

      //check if home team has possession

      if (this.elementExists(game.competitions[0].situation, "lastPlay")) {
        if (game.competitions[0].situation.lastPlay.team.id === game.competitions[0].competitors[0].id) {
          possessionTeam = game.competitions[0].competitors[0].team.abbreviation;
        }
        if (game.competitions[0].situation.lastPlay.team.id === game.competitions[0].competitors[1].id) {
          possessionTeam = game.competitions[0].competitors[1].team.abbreviation;
        }
      }

      const gameExists = await Livegame.exists({ eventId: game.id });
      const gameWasInPregame = await Pregame.exists({eventId: game.id});

      if (gameExists === false && gameWasInPregame === true) {

        console.log("Adding new live game...")

        const contents = {
          eventId: game.id,
          state: 'in',
          stateDetails: game.status.type.name,
          sport: sport,
          league: league,
          homeLogo: game.competitions[0].competitors[0].team.logo,
          awayLogo: game.competitions[0].competitors[1].team.logo,
          homeScore: game.competitions[0].competitors[0].score,
          awayScore: game.competitions[0].competitors[1].score,
          homeAbbreviation: game.competitions[0].competitors[0].team.abbreviation,
          awayAbbreviation: game.competitions[0].competitors[1].team.abbreviation,
          homeFullName: game.competitions[0].competitors[0].team.displayName,
          awayFullName: game.competitions[0].competitors[1].team.displayName,
          homeColor: game.competitions[0].competitors[0].team.color,
          awayColor: game.competitions[0].competitors[1].team.color,
          startTime: game.date,
          time: game.competitions[0].status.displayClock,
          period: game.competitions[0].status.period,
          lastPlay: "",
          spread: "",
          overUnder: -1
        };

        if (this.elementExists(game.competitions[0].competitors[0], "records")) {
          contents.homeRecord = game.competitions[0].competitors[0].records[0].summary;
        }

        if (this.elementExists(game.competitions[0].competitors[1], "records")) {
          contents.awayRecord = game.competitions[0].competitors[1].records[0].summary;
        }

        if (this.elementExists(game.competitions[0].situation, "lastPlay")) {
          contents.lastPlay = game.competitions[0].situation.lastPlay.text
        }

        if (game.competitions[0].broadcasts.length > 0) {
          contents.broadcasts = game.competitions[0].broadcasts[0].names
        }

        //find game in pregame DB
        Pregame.findOne({ eventId: game.id }, (err, result) => {
          if (err) {
            console.log(err);
            return
          }
          else {
            contents.spread = result.spread;
            contents.overUnder = result.overUnder;
          }
        });

        Pregame.findOneAndDelete({ eventId: game.id }, (err, result) => {
          if (err) {
            console.log(err);
          }
        });

        switch(league) {
          case 'nfl':

            contents.specificData = {
              down: game.competitions[0].situation.down,
              distance: game.competitions[0].situation.distance,
              yardLine: game.competitions[0].situation.yardLine,
              isRedZone: game.competitions[0].situation.isRedZone,
              possession: possessionTeam,
              awayTimeouts: game.competitions[0].situation.awayTimeouts,
              homeTimeouts: game.competitions[0].situation.homeTimeouts
            };
            break;

          case 'college-football':

            contents.specificData = {
              homeRank: game.competitions[0].competitors[0].curatedRank.current,
              awayRank: game.competitions[0].competitors[1].curatedRank.current,
              down: game.competitions[0].situation.down,
              distance: game.competitions[0].situation.distance,
              yardLine: game.competitions[0].situation.yardLine,
              isRedZone: game.competitions[0].situation.isRedZone,
              possession: possessionTeam,
              awayTimeouts: game.competitions[0].situation.awayTimeouts,
              homeTimeouts: game.competitions[0].situation.homeTimeouts
            };
            break;

          case 'mens-college-basketball':

            //add logic for whether or not a team is in bonus

            contents.specificData = {
              homeRank: game.competitions[0].competitors[0].curatedRank.current,
              awayRank: game.competitions[0].competitors[1].curatedRank.current,
              possession: possessionTeam,
              awayTimeouts: game.competitions[0].situation.awayTimeouts,
              homeTimeouts: game.competitions[0].situation.homeTimeouts

              //need to test on live game to see where these fields are located
              //homeFouls: ,
              //awayFouls: ,
              //homeInBonus: ,
              //awayInBonus:
            };
            break;
          default:
            contents.specificData = {};
        }

        let g = new Livegame( contents );
        g.save();

      }

      //TODO: make an actual fix for updating game info in games that
      //have an empty situation array. Right now we don't update the
      //games at all if they don't have lastPlay info...this avoids
      //the error we were seeing but does not work as a final solution.
      else if (game.status.type.name === "STATUS_IN_PROGRESS") {

        console.log("Updating existing game...")

        //first, update the live game entry

        switch(league) {
          case 'nfl':
            Livegame.findOneAndUpdate({ eventId: game.id }, {
              homeScore: game.competitions[0].competitors[0].score,
              awayScore: game.competitions[0].competitors[1].score,
              time: game.competitions[0].status.displayClock,
              period: game.competitions[0].status.period,
              lastPlay: game.competitions[0].situation.lastPlay.text,
              specificData: {
                down: game.competitions[0].situation.down,
                distance: game.competitions[0].situation.distance,
                yardLine: game.competitions[0].situation.yardLine,
                isRedZone: game.competitions[0].situation.isRedZone,
                possession: possessionTeam,
                awayTimeouts: game.competitions[0].situation.awayTimeouts,
                homeTimeouts: game.competitions[0].situation.homeTimeouts
              }
            }, (err, result) => {
              if (err) console.log(err);
            });
            break;

          case 'college-football':
            Livegame.findOneAndUpdate({ eventId: game.id }, {
              homeScore: game.competitions[0].competitors[0].score,
              awayScore: game.competitions[0].competitors[1].score,
              time: game.competitions[0].status.displayClock,
              period: game.competitions[0].status.period,
              lastPlay: game.competitions[0].situation.lastPlay.text,
              specificData: {
                homeRank: game.competitions[0].competitors[0].curatedRank.current,
                awayRank: game.competitions[0].competitors[1].curatedRank.current,
                down: game.competitions[0].situation.down,
                distance: game.competitions[0].situation.distance,
                yardLine: game.competitions[0].situation.yardLine,
                isRedZone: game.competitions[0].situation.isRedZone,
                possession: possessionTeam,
                awayTimeouts: game.competitions[0].situation.awayTimeouts,
                homeTimeouts: game.competitions[0].situation.homeTimeouts
              }
            }, (err, result) => {
              if (err) console.log(err);
            });
            break;

          case 'mens-college-basketball':

              Livegame.findOneAndUpdate({ eventId: game.id }, {
                homeScore: game.competitions[0].competitors[0].score,
                awayScore: game.competitions[0].competitors[1].score,
                time: game.competitions[0].status.displayClock,
                period: game.competitions[0].status.period,
                lastPlay: game.competitions[0].situation.lastPlay.text,
                specificData: {
                  homeRank: game.competitions[0].competitors[0].curatedRank.current,
                  awayRank: game.competitions[0].competitors[1].curatedRank.current,
                  possession: possessionTeam,
                  awayTimeouts: game.competitions[0].situation.awayTimeouts,
                  homeTimeouts: game.competitions[0].situation.homeTimeouts
                }
              }, (err, result) => {
                if (err) console.log(err);
              });
              break;
        }

        //look to see if current play has been logged in DB
        const playExists = await Play.exists({ playId: game.competitions[0].situation.lastPlay.id });

        //if not, create the play and add to the Play collection
        if (playExists === false) {

          console.log("Adding new play...");

          const playData = {
            playId: game.competitions[0].situation.lastPlay.id,
            description: game.competitions[0].situation.lastPlay.text,
            eventId: game.id
          };

          //for testing purposes - packers v bears game ID is 401220290

          switch(league) {
            case 'nfl':
              playData.specificData = {
                homeScore: game.competitions[0].competitors[0].score,
                awayScore: game.competitions[0].competitors[1].score,
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
                homeScore: game.competitions[0].competitors[0].score,
                awayScore: game.competitions[0].competitors[1].score,
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
                homeScore: game.competitions[0].competitors[0].score,
                awayScore: game.competitions[0].competitors[1].score,
                time: game.competitions[0].status.displayClock,
                half: game.competitions[0].status.period,
                possession: possessionTeam
              }
              break;
          }

          let currentPlay = new Play( playData );
          currentPlay.save();
        }
      }
    }
  }


  //POSTGAME LOGIC

  async postgameLogic(games, sport, league) {

    for (const game of games) {

      const gameExists = await Postgame.exists({ eventId: game.id });
      const gameWasInLive = await Livegame.exists({ eventId: game.id });

      if (gameExists === false && game.status.type.name !== "STATUS_CANCELED" && game.status.type.name !== "STATUS_POSTPONED" && gameWasInLive === true) {

        console.log("Adding completed game...")

        const contents = {
          eventId: game.id,
          state: 'post',
          stateDetails: game.status.type.name,
          sport: sport,
          league: league,
          homeLogo: game.competitions[0].competitors[0].team.logo,
          awayLogo: game.competitions[0].competitors[1].team.logo,
          homeScore: game.competitions[0].competitors[0].score,
          awayScore: game.competitions[0].competitors[1].score,
          homeAbbreviation: game.competitions[0].competitors[0].team.abbreviation,
          awayAbbreviation: game.competitions[0].competitors[1].team.abbreviation,
          homeFullName: game.competitions[0].competitors[0].team.displayName,
          awayFullName: game.competitions[0].competitors[1].team.displayName,
          homeColor: game.competitions[0].competitors[0].team.color,
          awayColor: game.competitions[0].competitors[1].team.color,
          homeRecord: game.competitions[0].competitors[0].records[0].summary,
          awayRecord: game.competitions[0].competitors[1].records[0].summary,
          spread: "",
          overUnder: -1,
          spreadWinner: "P",
          ouResult: "P"
        };

        //find game in livegame collection
        Livegame.findOne({ eventId: game.id }, (err, result) => {
          if (err) {
            console.log(err);
            return
          }
          else {
            contents.spread = result.spread;
            contents.overUnder = result.overUnder;
            if (spread) { contents.spreadWinner = this.calculateSpreadWinner(); }
            if (overUnder !== -1) { contents.ouResult = this.calculateOuResult(); }
          }
        });

        Livegame.findOneAndDelete({ eventId: game.id }, (err, result) => {
          if (err) {
            console.log(err);
          }
        });

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


        //add specific data

        switch(league) {
          case 'nfl':
            break;
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

        let g = new Postgame( contents );
        g.save();
      }
    }
  }

};

module.exports = {
  GameService: GameService
};
