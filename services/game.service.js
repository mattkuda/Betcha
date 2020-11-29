
/*
Updates games within our database, making use of the ESPN API to obtain information about each game.
*/


//import mongoose models
const Pregame = require('../models/game.pre');
const Livegame = require('../models/game.live');
const Postgame = require('../models/game.post');
const Play = require('../models/play');


//import libraries
const fetch = require('node-fetch');


/*

TODO:

1a. Change to state: game.status.type.state (pre/in/post) --> DONE

2. Get the addedContents() function written so we can dynamically
add fields to a document based on the sport and league --> DONE - we use a switch case block instead

3. Rethink the ctr functionality for line dancing that may occur.

4. Add betting logic for postgame entries

5. Test this on other sport list entries (not just NFL).

6. Look at ways to make this faster...can we reach out to the ESPN API and process
the data in parallel? Or is this something we have to do sequentially? Run speed tests
on different methods to find the best one.

*/


class GameService {
  constructor() {
    this.ctr = 1;

    //in-season sports that we care about
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

    this.pregameLogic(games_pre, sport, league);
    //this.liveLogic(games_in, sport, league);
    //this.postgameLogic(games_post, sport, league);
  }


  async pregameLogic(games, sport, league) {

    let updatePregames = new Boolean(this.ctr === 120);

    for (const game of games) {

      const gameExists = await Pregame.exists({ _id: game.id });

      if (gameExists === false && this.elementExists(game.competitions[0], "odds")) {

        console.log("Adding new upcoming game...")

        const contents = {
          _id: game.id,
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
            contents.specificData = {
              weatherDescription: game.weather.displayValue,
              highTemp: game.weather.temperature,
            };
            break;
          case 'college-football':
            contents.specificData = {
              weatherDescription: game.weather.displayValue,
              highTemp: game.weather.temperature,
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

        let g = new Pregame( contents );
        g.save();
      }

      else {

        if (updatePregames && this.elementExists(game.competitions[0], "odds")) {
          Pregame.findByIdAndUpdate(game.id, {
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
      if (game.competitions[0].situation.lastPlay.team.id === game.competitions[0].competitors[0].id) {
        possessionTeam = game.competitions[0].competitors[0].team.abbreviation;
      }
      //check if away team has possession
      if (game.competitions[0].situation.lastPlay.team.id === game.competitions[0].competitors[1].id) {
        possessionTeam = game.competitions[0].competitors[1].team.abbreviation;
      }

      const gameExists = await Livegame.exists({ _id: game.id });

      if (gameExists === false) {

        console.log("Adding new live game...")

        let localSpread = "";
        let localOU = "";

        //find game in pregame DB
        let pregameEntry = Pregame.findById(game.id, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            if (result) {
              localSpread = result.spread;
              localOU = result.overUnder;
            }
          }
        });

        Pregame.findByIdAndDelete(game.id, (err, result) => {
          if (err) {
            console.log(err);
          }
        });

        const contents = {
          _id: game.id,
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
          homeRecord: game.competitions[0].competitors[0].records[0].summary,
          awayRecord: game.competitions[0].competitors[1].records[0].summary,
          startTime: game.date,
          broadcasts: game.competitions[0].broadcasts[0].names,
          time: game.competitions[0].status.displayClock,
          period: game.competitions[0].status.period,
          lastPlay: game.competitions[0].situation.lastPlay.text
        };

        contents.spread = localSpread;
        contents.overUnder = localOU;

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

      else {

        console.log("Updating existing game...")



        //first, update the live game entry

        switch(league) {
          case 'nfl':
            livegame.findByIdAndUpdate(game.id, {
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
            livegame.findByIdAndUpdate(game.id, {
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
            livegame.findByIdAndUpdate(game.id, {
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
        const playExists = await Play.exists({ _id: game.competitions[0].situation.lastPlay.id });

        //if not, create the play and add to the Play collection
        if (playExists === false) {

          console.log("Adding new play...");

          const playData = {
            _id: game.competitions[0].situation.lastPlay.id,
            description: game.competitions[0].situation.lastPlay.text,
            gameId: game.id
          };

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

      const gameExists = await Postgame.exists({ _id: game.id });

      if (gameExists === false && game.status.type.name != "STATUS_CANCELED" && game.status.type.name != "STATUS_POSTPONED") {

        console.log("Adding completed game...")

        let localSpread = "";
        let localOU = "";

        //find game in livegame collection
        let livegameEntry = Livegame.findById(game.id, (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            localSpread = result.spread;
            localOU = result.overUnder;
          }
        });

        Livegame.findByIdAndDelete(game.id, (err, result) => {
          if (err) {
            console.log(err);
          }
        });

        const contents = {
          _id: game.id,
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
          spread: localSpread,
          overUnder: localOU
        };

        // contents.spread = localSpread;
        // contents.overUnder = localOU;

        //spread winner --> calculate this here
        //did O/U hit? --> calculate this here

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
