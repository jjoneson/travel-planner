/**
 * Created by Jeff Joneson on 7/10/2017.
 */
import React from "react"
import {Button, Col, Glyphicon, Grid, Row} from "react-bootstrap"
import {DestinationFieldSet} from "./DestinationFieldSet"
import {addHours, getHoursDifference} from "../common/common"

export class Destination extends React.Component {
  state = {
    dest: this.props.dest,
    edit: this.props.edit,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (!this.valid()) return
    this.save()
  }

  valid = () => {
    const validations = [
      this.validationStateName(),
      this.validationStateDate(),
      this.validationStateDuration()
    ]

    return !validations.some((result => String(result) !== "success"))
  }

  checkNull(prop) {
    if (!prop) return 'error'
    if (prop.length > 0) return 'success'
  }

  checkNumeric(prop) {
    if (this.checkNull(prop) === 'error') return 'error'
    if (isNaN(parseFloat(prop)) || !isFinite(prop)) return 'error'
    return 'success'
  }

  validationStateName = () => this.checkNull(this.state.dest.name)
  validationStateDate = () => this.checkNull(this.state.dest.date)
  validationStateDuration = () => this.checkNumeric(this.state.dest.duration)
  validationStateArrival = () => this.checkNull(this.state.dest.arrival)
  validationStateDeparture = () => this.checkNull(this.state.dest.departure)

  handleChange = (e) => {
    const newData = this.state.dest

    if (e.target.name === "duration" && !isNaN(parseFloat(e.target.value))) {
      newData["departure"] = addHours(newData.arrival, e.target.value)
      newData["duration"] = parseFloat(e.target.value)
      this.setState({dest: newData})
      return
    }

    if (e.target.name === "departure") {
      newData["duration"] = getHoursDifference(newData.arrival, e.target.value)
    }

    if (e.target.name === "arrival") {
      newData["duration"] = getHoursDifference(e.target.value, newData.departure)
    }

    newData[e.target.name] = e.target.value
    this.setState({dest: newData})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({dest: nextProps.dest, edit: nextProps.edit})
  }

  save() {
    this.setState({edit: false})
    this.props.save({dest: this.state.dest, edit: false},
      this.props.index)
  }

  deleteThis(i) {
    this.props.delete(i)
  }

  render() {
    const buttons = () => {
      if (this.state.edit) {
        return (
          <Row>
            <Col sm={2} smPush={4}>
              <Button bsStyle="primary" type="submit" block disabled={!this.valid()}>Save</Button>
            </Col>
            <Col sm={2} smPush={4}>
              <Button bsStyle="danger" block onClick={this.deleteThis.bind(this)}>Delete</Button>
            </Col>
          </Row>
        )
      }

      return (
        <Row>
          <Col sm={2} smPush={4}>
            <Button block bsStyle="primary" onClick={() => this.setState({edit: true})}>Edit</Button>
          </Col>
          <Col sm={2} smPush={4}>
            <Button block bsStyle="default" onClick={() => this.props.insertNode(this.props.index)}>Insert Dest</Button>
          </Col>
        </Row>
      )
    }

    const content = () => {
      return (
        <div>
          <Row>
            <DestinationFieldSet label="Name:" width={7} value={this.state.dest.name}
                                 name="name" type="text" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateName()}/>
            <DestinationFieldSet label="Date:" width={5} value={this.state.dest.date}
                                 name="date" type="date" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateDate()}/>
          </Row>
          <Row>
            <DestinationFieldSet label="Arrival:" width={5} value={this.state.dest.arrival}
                                 name="arrival" type="datetime-local" edit={this.state.edit}
                                 onChange={this.handleChange}
                                 validationState={this.validationStateArrival()}/>
            <DestinationFieldSet label="Hours:" width={2} value={this.state.dest.duration}
                                 name="duration" type="text" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateDuration()}/>
            <DestinationFieldSet label="Departure:" width={5} value={this.state.dest.departure}
                                 name="departure" type="datetime-local" edit={this.state.edit}
                                 onChange={this.handleChange}
                                 validationState={this.validationStateDeparture()}/>
            <DestinationFieldSet label="Url:" width={12} value={this.state.dest.url}
                                 name="url" type="text" edit={this.state.edit} onChange={this.handleChange}/>
            <DestinationFieldSet label="Info:" width={12} value={this.state.dest.info}
                                 name="info" type="textarea" edit={this.state.edit} onChange={this.handleChange}/>
          </Row>
        </div>
      )
    }

    if (this.state.edit) return (
      <Grid className={"node node-write"}>
        <form onSubmit={this.handleSubmit}>
          {content()}
          {buttons()}
        </form>
      </Grid>
    )

    return (
      <Grid className={"node node-read"}>
        <Button bsSize="xsmall" onClick={() => this.props.move(global.UP, this.props.index)}>
          <Glyphicon glyph="arrow-up"/>
        </Button>
        <Button bsSize="xsmall" onClick={() => this.props.move(global.DOWN, this.props.index)}>
          <Glyphicon glyph="arrow-down"/>
        </Button>
        {content()}
        {buttons()}
      </Grid>
    )
  }
}
