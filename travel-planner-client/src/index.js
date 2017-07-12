import React from "react"
import ReactDOM from "react-dom"
import "./site.css"
import $ from "jquery"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, Navbar, Row} from "react-bootstrap"
import {Destination} from "./trip/Destination"
window.jQuery = $
window.$ = $
global.jQuery = $

global.UP = "up"
global.DOWN = "down"

class Trip extends React.Component {
  constructor() {
    super()
    this.state = {
      nodes: [],
    }
  }

  render() {
    const nodes = this.state.nodes
      .map(function (node, i) {
        const prev = this.state.nodes[i - 1]
        node.dest.arrival = prev && prev.dest.departure ? prev.dest.departure : node.dest.arrival
        node.dest.date = prev && prev.dest.date ? overnight(prev) ? addDays(prev.date, 1) : prev.dest.date : node.dest.date
        return <div key={i}>
          <Destination
            dest={node.dest}
            edit={node.edit}
            save={(data, i) => this.saveDestination(data, i)}
            move={(direction, i) => this.moveNode(direction, i)}
            insertNode={(i) => this.insertNode(i)}
            delete={this.deleteDestination.bind(this, i)}
            index={i}
          />
        </div>
      }, this)
    return (
      <div>
        <Topbar value={this.state.searchCriteria} onSubmit={() => this.loadTrip()} onChange={this.handleSearchChange}/>
        <Namer value={this.state.name} onSubmit={this.saveTrip} onChange={this.handleNameChange}/>
        {nodes}
        <Adder onClick={() => this.insertNode(this.state.nodes.length)}/>
      </div>
    )
  }

  handleSearchChange = (e) => {
    this.setState({searchCriteria: e.target.value})
  }
  handleNameChange = (e) => {
    this.setState({name: e.target.value})
  }


  insertNode(i) {
    let insertLoc = i === this.state.nodes.length ? this.state.nodes.length : i + 1
    const newNodes = this.state.nodes.slice()
    const prev = newNodes[i - 1]
    newNodes.splice(insertLoc, 0, {
      dest: {
        date: prev && prev.dest.date ? overnight(prev) ? addDays(prev.dest.date, 1) : prev.dest.date : new Date().toJSON().slice(0, 10),
        arrival: prev && prev.dest.departure ? prev.dest.departure : "12:00",
        locationType: "City",
        departure: prev && prev.dest.departure ? prev.dest.departure : "13:00",
      },
      edit: true
    })

    for (let j = 0; j < newNodes.count; j++) {
      newNodes[j].index = j
    }

    this.setState({
      nodes: newNodes
    })
  }

  moveNode(direction, i) {
    const newNodes = this.state.nodes.slice()
    const j = direction === global.UP ? i - 1 : i + 1
    if (!newNodes[j]) {
      return
    }

    [newNodes[i], newNodes[j]] = [newNodes[j], newNodes[i]];
    [newNodes[i].dest.arrival, newNodes[j].dest.arrival] = [newNodes[j].dest.arrival, newNodes[i].dest.arrival];
    [newNodes[i].dest.departure, newNodes[j].dest.departure] = [newNodes[j].dest.departure, newNodes[i].dest.departure]

    this.setState({nodes: newNodes})
  }

  deleteDestination(i) {
    const newNodes = this.state.nodes.slice()
    newNodes.splice(i, 1)
    this.setState({nodes: newNodes})
  }

  loadTrip() {
    const handleLoad = (data) => {
      const nodes = []
      console.log(data)
      data.Destinations.forEach(dest => nodes.push({dest: dest}))
      this.setState({name: data.Name, tripId: data.TripId, nodes: nodes})
    }

    const name = this.state.searchCriteria

    $.get("https://travel-planner.io/api/load", {name: name}).done(function (data) {
      handleLoad(JSON.parse(data))
    })

  }

  saveTrip = (e) => {
    const handleLoad = (data) => {
      const nodes = []
      console.log(data)
      data.Destinations.forEach(dest => nodes.push({dest: dest}))
      this.setState({name: data.Name, tripId: data.TripId, nodes: nodes})
    }

    if (e) e.preventDefault()
    const payload = this.state.nodes.map(node => {
      return node.dest
    })

    const trip = {
      tripId: this.state.tripId,
      destinations: payload,
      name: this.state.name
    }

    $.post("https://travel-planner.io/api/save", JSON.stringify(trip))
      .done(function (data) {
        handleLoad(JSON.parse(data))
      })
  }


  saveDestination(node, i) {
    const newNodes = this.state.nodes.slice()
    newNodes[i] = node
    newNodes.splice(i, 1, newNodes[i])
    this.setState({nodes: newNodes})
    this.saveTrip()
  }
}

function Topbar(props) {
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">Travel Planner</a>
        </Navbar.Brand>
        <Navbar.Toggle/>
      </Navbar.Header>
      <Navbar.Collapse>
        <Navbar.Form pullLeft>
          <FormGroup>
            <FormControl value={props.value} onChange={props.onChange} type="text" placeholder="Load Trip"/>
          </FormGroup>
          <Button onClick={props.onSubmit}>Load</Button>
        </Navbar.Form>
      </Navbar.Collapse>
    </Navbar>
  )
}

function Namer(props) {
  return (
    <Grid className="namer">
      <Row>
        <Col sm={4} smPush={4} className="node node-read">
          <form onSubmit={props.onSubmit}>
            <FormGroup controlId="formControlsTripName">
              <ControlLabel>Trip Name</ControlLabel>
              <FormControl value={props.name} onChange={props.onChange} type="text" placeholder="Trip name"/>
            </FormGroup>
            <Button type="submit" bsStyle="default" block>
              Name Trip
            </Button>
          </form>
        </Col>
      </Row>
    </Grid>
  )
}

function Adder(props) {
  return (
    <Grid>
      <Row>
        <Col sm={2} smPush={5} className="node node-read">
          <Button bsStyle="default" block onClick={props.onClick}>
            Add Dest
          </Button>
        </Col>
      </Row>
    </Grid>
  )
}

function overnight(prev) {
  return (
  prev &&
  prev.dest.arrival &&
  prev.dest.departure &&
  prev.dest.arrival.slice(0, 2) > prev.dest.departure.slice(0, 2))
}

function addDays(date, days) {
  let d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toJSON().slice(0, 10)
}

// ========================================


ReactDOM
  .render(
    <Trip />,
    document
      .getElementById(
        'root'
      )
  )

