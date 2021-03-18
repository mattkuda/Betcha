import React, { useState, useContext, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import { Input, Menu, Grid, Modal, Button, Image, Container, Label } from 'semantic-ui-react';
import { AuthContext } from "../context/auth";
import { FETCH_HEADER_INFO_FOR_GAME } from "../util/graphql";
import { hexToRgb } from "../util/Extensions/hexToRgb";
import "./GameDetailsHeader.css";


function GameDetailsHeader(props) {

  let myGameId = props.gameId;
  let myLeague = props.league;

  const { loading, error, data } = useQuery(FETCH_HEADER_INFO_FOR_GAME, {
    variables: { myGameId },
  });


  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const awayColorRgb = hexToRgb(data.getGameByID.awayColor);
  const homeColorRgb = hexToRgb(data.getGameByID.homeColor);

  return (

    <>
    <div className="header-wrapper mobile hidden">

      <div style = {{
        display: 'inline-block',
        width: '50%',
        backgroundImage: `linear-gradient(to bottom, rgba(${awayColorRgb.r},${awayColorRgb.g},${awayColorRgb.b},0), rgba(${awayColorRgb.r},${awayColorRgb.g},${awayColorRgb.b},.3))`
      }} className="header-content-left">
        <Grid rows={2}>
          <Grid.Row>
            <Grid columns={3} className="header-main-content-grid">
              <Grid.Column verticalAlign='middle'>
                <Image centered src={data.getGameByID.awayLogo} className='header-logo'/>
              </Grid.Column>
              <Grid.Column verticalAlign="middle" textAlign='center'>
                <div className="team-name">{data.getGameByID.awayFullName}</div>
                <div className="team-record">({data.getGameByID.awayRecord})</div>
              </Grid.Column>
              <Grid.Column verticalAlign='middle'>
                <div className="score-text">{data.getGameByID.awayScore}</div>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <Grid.Row>
            <Grid columns={3} textAlign="center" className="header-betting-odds-grid">
              <Grid.Column verticalAlign="middle">
                {data.getGameByID.awayId === data.getGameByID.favoredTeamId ? (
                  <div className="ml-text">ML: {data.getGameByID.awayML}</div>
                ):(
                  <div className="ml-text">ML: +{data.getGameByID.awayML}</div>
                )}
              </Grid.Column>
              <Grid.Column verticalAlign='middle'>
                {data.getGameByID.awayId === data.getGameByID.favoredTeamId ? (
                  <div className="ml-text">Spread: -{data.getGameByID.spread} ({data.getGameByID.awaySpreadOdds})</div>
                ):(
                  <div className="ml-text">Spread: +{data.getGameByID.spread} ({data.getGameByID.awaySpreadOdds})</div>
                )}
              </Grid.Column>
              <Grid.Column verticalAlign='middle' textAlign='right'>
                <div className="ou-text">OU:</div>
              </Grid.Column>
            </Grid>
          </Grid.Row>
        </Grid>

      </div>

      <div style = {{
        display: 'inline-block',
        width: '50%',
        backgroundImage: `linear-gradient(to bottom, rgba(${homeColorRgb.r},${homeColorRgb.g},${homeColorRgb.b},0), rgba(${homeColorRgb.r},${homeColorRgb.g},${homeColorRgb.b},.3))`
      }} className="header-content-right">
        <Grid rows={2}>
          <Grid.Row>
            <Grid columns={3} className="header-main-content-grid">
              <Grid.Column verticalAlign='middle'>
                <div className="score-text">{data.getGameByID.homeScore}</div>
              </Grid.Column>
              <Grid.Column verticalAlign="middle" textAlign='center'>
                <div className="team-name">{data.getGameByID.homeFullName}</div>
                <div className="team-record">({data.getGameByID.homeRecord})</div>
              </Grid.Column>
              <Grid.Column verticalAlign='middle'>
                <Image centered src={data.getGameByID.homeLogo} className='header-logo'/>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <Grid.Row>
              <Grid columns={3} textAlign="center" className="header-betting-odds-grid">
                <Grid.Column textAlign='left'>
                  <div className="ou-value">{data.getGameByID.overUnder}</div>
                </Grid.Column>
                <Grid.Column>
                  {data.getGameByID.homeId === data.getGameByID.favoredTeamId ? (
                    <div className="ml-text">Spread: -{data.getGameByID.spread} ({data.getGameByID.homeSpreadOdds})</div>
                  ):(
                    <div className="ml-text">Spread: +{data.getGameByID.spread} ({data.getGameByID.homeSpreadOdds})</div>
                  )}
                </Grid.Column>
                <Grid.Column>
                  {data.getGameByID.homeId === data.getGameByID.favoredTeamId ? (
                    <div className="ml-text">ML: {data.getGameByID.homeML}</div>
                  ):(
                    <div className="ml-text">ML: +{data.getGameByID.homeML}</div>
                  )}
                </Grid.Column>
            </Grid>
          </Grid.Row>

        </Grid>
      </div>

      <div>
      </div>
    </div>






    <div className="header-wrapper-mobile mobile only">

      <div style = {{
        display: 'inline-block',
        width: '50%',
        backgroundImage: `linear-gradient(to bottom, rgba(${awayColorRgb.r},${awayColorRgb.g},${awayColorRgb.b},0), rgba(${awayColorRgb.r},${awayColorRgb.g},${awayColorRgb.b},.3))`
      }} className="header-content-left">
        <Grid rows={2} style={{
            margin: '0px auto',
            verticalAlign: 'middle',
          }}>
          <Grid.Row style={{
              paddingBottom: '0px',
              paddingTop: '5px',
            }} verticalAlign='middle'>
            <Grid columns={3} className="header-main-content-grid">
              <Grid.Column verticalAlign='middle'>
                <Image centered src={data.getGameByID.awayLogo} className='header-logo'/>
              </Grid.Column>
              <Grid.Column verticalAlign="middle" textAlign='center'>
                <div className="team-name">{data.getGameByID.awayFullName}</div>
                <div className="team-record">({data.getGameByID.awayRecord})</div>
              </Grid.Column>
              <Grid.Column verticalAlign='middle'>
                <div className="score-text">{data.getGameByID.awayScore}</div>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <Grid.Row style={{
              paddingTop: '5px',
              paddingBottom: '0px',
            }} verticalAlign='middle'>
            <Grid columns={3} textAlign="center" className="header-betting-odds-grid">
              <Grid.Column style={{
                  paddingTop: '0px',
                }}>
                {data.getGameByID.awayId === data.getGameByID.favoredTeamId ? (
                  <div className="ml-text">ML: {data.getGameByID.awayML}</div>
                ):(
                  <div className="ml-text">ML: +{data.getGameByID.awayML}</div>
                )}
              </Grid.Column>
              <Grid.Column style={{
                  paddingTop: '0px',
                }}>
                {data.getGameByID.awayId === data.getGameByID.favoredTeamId ? (
                  <div className="ml-text">-{data.getGameByID.spread} ({data.getGameByID.awaySpreadOdds})</div>
                ):(
                  <div className="ml-text">+{data.getGameByID.spread} ({data.getGameByID.awaySpreadOdds})</div>
                )}
              </Grid.Column>
              <Grid.Column style={{
                  paddingTop: '0px',
                  paddingRight: '10px',
                }} textAlign='right'>
                <div className="ou-text">OU:</div>
              </Grid.Column>
            </Grid>
          </Grid.Row>
        </Grid>

      </div>

      <div style = {{
        display: 'inline-block',
        width: '50%',
        backgroundImage: `linear-gradient(to bottom, rgba(${homeColorRgb.r},${homeColorRgb.g},${homeColorRgb.b},0), rgba(${homeColorRgb.r},${homeColorRgb.g},${homeColorRgb.b},.3))`
      }} className="header-content-right">
        <Grid rows={2} style={{
            margin: '0px auto',
            verticalAlign: 'middle',
          }}>
          <Grid.Row style={{
              paddingBottom: '0px',
              paddingTop: '5px',
            }} verticalAlign='middle'>
            <Grid columns={3} className="header-main-content-grid">
              <Grid.Column verticalAlign='middle'>
                <div className="score-text">{data.getGameByID.homeScore}</div>
              </Grid.Column>
              <Grid.Column verticalAlign="middle" textAlign='center'>
                <div className="team-name">{data.getGameByID.homeFullName}</div>
                <div className="team-record">({data.getGameByID.homeRecord})</div>
              </Grid.Column>
              <Grid.Column verticalAlign='middle'>
                <Image centered src={data.getGameByID.homeLogo} className='header-logo'/>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <Grid.Row style={{
              paddingTop: '5px',
              paddingBottom: '0px',
            }} verticalAlign='middle'>
              <Grid columns={3} textAlign="center" className="header-betting-odds-grid">
                <Grid.Column style={{
                    paddingTop: '0px',
                    paddingLeft: '10px',
                  }} textAlign='left'>
                  <div className="ou-value">{data.getGameByID.overUnder}</div>
                </Grid.Column>
                <Grid.Column style={{
                    padding: '0px',
                  }}>
                  {data.getGameByID.homeId === data.getGameByID.favoredTeamId ? (
                    <div className="ml-text">-{data.getGameByID.spread} ({data.getGameByID.homeSpreadOdds})</div>
                  ):(
                    <div className="ml-text">+{data.getGameByID.spread} ({data.getGameByID.homeSpreadOdds})</div>
                  )}
                </Grid.Column>
                <Grid.Column style={{
                    padding: '0px',
                  }}>
                  {data.getGameByID.homeId === data.getGameByID.favoredTeamId ? (
                    <div className="ml-text">ML: {data.getGameByID.homeML}</div>
                  ):(
                    <div className="ml-text">ML: +{data.getGameByID.homeML}</div>
                  )}
                </Grid.Column>
            </Grid>
          </Grid.Row>

        </Grid>
      </div>

      <div>
      </div>
    </div>
    </>
  )
}


export default GameDetailsHeader;
