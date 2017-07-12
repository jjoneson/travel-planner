/**
 * Created by Jeff Joneson on 7/10/2017.
 */
import React from "react"

import {Button, Col, Glyphicon, Grid, Row} from "react-bootstrap"
import {DestinationFieldSet} from "./DestinationFieldSet"

export class Destination extends React.Component {
  state = {
    dest: this.props.dest,
    edit: this.props.edit
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
      this.validationStateLocationType(),
      this.validationStateArrival(),
      this.validationStateDeparture()
    ]

    return !validations.some((result => String(result) !== "success"))
  }

  checkNull(prop) {
    if (!prop) return 'error'
    if (prop.length > 0) return 'success'
  }

  validationStateName = () => this.checkNull(this.state.dest.name)
  validationStateDate = () => this.checkNull(this.state.dest.date)
  validationStateLocationType = () => this.checkNull(this.state.dest.locationType)
  validationStateArrival = () => this.checkNull(this.state.dest.arrival)
  validationStateDeparture = () => this.checkNull(this.state.dest.departure)

  handleChange = (e) => {
    const newData = this.state.dest
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
            <DestinationFieldSet label="Name:" width={6} value={this.state.dest.name}
                                 name="name" type="text" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateName()}/>
            <DestinationFieldSet label="Date:" width={6} value={this.state.dest.date}
                                 name="date" type="date" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateDate()}/>
          </Row>
          <Row>
            <DestinationFieldSet label="Location Type:" width={6} value={this.state.dest.locationType}
                                 name="locationType" select={true}
                                 options={["City", "Restaurant"]}
                                 edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateLocationType()}/>
            <DestinationFieldSet label="Arrival:" width={3} value={this.state.dest.arrival}
                                 name="arrival" type="time" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateArrival()}/>
            <DestinationFieldSet label="Departure:" width={3} value={this.state.dest.departure}
                                 name="departure" type="time" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateDeparture()}/>
            <DestinationFieldSet label="Url:" width={12} value={this.state.dest.url}
                                 name="url" type="text" edit={this.state.edit} onChange={this.handleChange}/>
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
