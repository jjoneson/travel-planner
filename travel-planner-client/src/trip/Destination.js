/**
 * Created by Jeff Joneson on 7/10/2017.
 */
import React from "react"

import {Button, Col, Glyphicon, Grid, Row} from "react-bootstrap"
import {DestinationFieldSet} from "./DestinationFieldSet"

export class Destination extends React.Component {
  state = {
    edit: true,
    data: this.props.data
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

  validationStateName = () => this.checkNull(this.state.data.name)
  validationStateDate = () => this.checkNull(this.state.data.date)
  validationStateLocationType = () => this.checkNull(this.state.data.locationType)
  validationStateArrival = () => this.checkNull(this.state.data.arrival)
  validationStateDeparture = () => this.checkNull(this.state.data.departure)

  handleChange = (e) => {
    const newData = this.state.data
    newData[e.target.name] = e.target.value
    this.setState({data: newData})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data, edit: nextProps.edit})
  }

  save() {
    this.props.save({data: this.state.data, edit: !this.props.edit,},
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
            <DestinationFieldSet label="Name:" width={6} value={this.state.data.name}
                                 name="name" type="text" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateName()}/>
            <DestinationFieldSet label="Date:" width={6} value={this.state.data.date}
                                 name="date" type="date" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateDate()}/>
          </Row>
          <Row>
            <DestinationFieldSet label="Location Type:" width={6} value={this.state.data.locationType}
                                 name="locationType" select={true}
                                 options={["City", "Restaurant"]}
                                 edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateLocationType()}/>
            <DestinationFieldSet label="Arrival:" width={3} value={this.state.data.arrival}
                                 name="arrival" type="time" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateArrival()}/>
            <DestinationFieldSet label="Departure:" width={3} value={this.state.data.departure}
                                 name="departure" type="time" edit={this.state.edit} onChange={this.handleChange}
                                 validationState={this.validationStateDeparture()}/>
            <DestinationFieldSet label="Url:" width={12} value={this.state.data.url}
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
