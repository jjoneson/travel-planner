import React from "react"
import {Button, Col, Grid, Row, Table} from "react-bootstrap"
import $ from "jquery"
import FormControl from "react-bootstrap/es/FormControl"
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../site.css"

window.jQuery = $
window.$ = $
global.jQuery = $

export default class Aurora extends React.Component {
  constructor() {
    super()
    this.state = {
      Auroras: {},
      latitude: "",
      longitude: "",
      odds: 0,
      Latitudes: []
    }


  }

  auroraMap(knownAuroras) {
    if (!knownAuroras) {
      return
    }
    const auroras = knownAuroras
      .map(function (aurora, i) {
        const date = new Date(aurora.Time)
        const time = date.getHours() + ":" + date.getMinutes()
        return <Row key={i}>
          <Col sm={2}>{aurora.Place}</Col>
          <Col sm={2}>{aurora.Odds}</Col>
          <Col sm={2}>{time}</Col>
        </Row>
      }, this)
    return auroras
  }

  mapMap(oddsMap) {
    if (!oddsMap || oddsMap.length < 1) {
      return
    }
    console.log(oddsMap)
    const newMap = oddsMap
      .map(function (lat, i) {
        const row = lat.Auroras
          .map(function (item, j) {
            return <td>{item.Odds}</td>
          })
        return (
          <tr key={i}>
            {row}
          </tr>
        )

      })
    return newMap
  }


  render() {
    if (!this.state.Latitudes || this.state.Latitudes.length < 1) {
      this.getMap()
    }

    const oddsMap = this.mapMap(this.state.Latitudes)

    return (
      <Grid>
        <Row>
          <form onSubmit={this.getAuroraOdds}>
            <Col sm={2}>
              <FormControl type="text" value={this.state.latitude} placeholder="latitude"
                           onChange={this.handleLatitudeChange}/>
            </Col>
            <Col sm={2}>
              <FormControl type="text" value={this.state.longitude} placeholder="longitude"
                           onChange={this.handleLongitudeChange}/>
            </Col>
            <Col sm={3}>
              <Button type="submit" value="submit">Get Current Odds</Button>
            </Col>
            <Col sm={2}>
              <span>Odds: {this.state.odds}</span>
            </Col>
          </form>
        </Row>
        <Row>
          <Col>
            <h3>
              The table below roughly represents the United States.
              The map covers west to east, with the top being the Canadian Border.
              The bottom is approximately the latitude of Omaha, Nebraska.
              This data should be up to date on a 5 minute interval (just refresh your browser)
            </h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table className="odds-map">
              {oddsMap}
            </Table>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Button onClick={() => this.getKnownOdds()}> Get Archived Aurora Odds</Button>
          </Col>
        </Row>
        {this.auroraMap(this.state.Auroras["Omaha"])}
        {this.auroraMap(this.state.Auroras["Lincoln"])}
        {this.auroraMap(this.state.Auroras["Sioux City"])}
        {this.auroraMap(this.state.Auroras["Fargo"])}
        {this.auroraMap(this.state.Auroras["Fairbanks"])}
        {this.auroraMap(this.state.Auroras["South Greenland"])}
      </Grid>
    )
  }

  handleLatitudeChange = (e) => {
    this.setState({latitude: e.target.value})
  }
  handleLongitudeChange = (e) => {
    this.setState({longitude: e.target.value})
  }

  getAuroraOdds = (e) => {
    e.preventDefault()
    const lat = this.state.latitude
    const long = this.state.longitude
    const handleLoad = (data) => {
      this.setState({odds: data})
      console.log(data)
    }
    $.get("https://travel-planner.io/api/getCurrentAuroraOdds", {latitude: lat, longitude: long}).done(function (data) {
      handleLoad(JSON.parse(data))
    })
  }

  getKnownOdds() {
    this.getKnownAuroraOdds("Fargo")
    this.getKnownAuroraOdds("Fairbanks")
    this.getKnownAuroraOdds("South Greenland")
    this.getKnownAuroraOdds("Sioux City")
    this.getKnownAuroraOdds("Omaha")
    this.getKnownAuroraOdds("Lincoln")
  }

  getMap() {
    const handleLoad = (data) => {
      this.setState({Latitudes: data.Latitudes})
      console.log(data)
    }

    $.get("https://travel-planner.io/api/getMap").done(function (data) {
      handleLoad(JSON.parse(data))
    })
  }


  getKnownAuroraOdds(place) {
    const handleLoad = (data) => {
      let old = {}
      if (this.state.Auroras) {
        old = this.state.Auroras
      }
      old[place] = data
      this.setState({Auroras: old})
      console.log(data)
    }

    $.get("https://travel-planner.io/api/getKnownAuroraOdds", {place: place}).done(function (data) {
      handleLoad(JSON.parse(data))
    })
  }

}