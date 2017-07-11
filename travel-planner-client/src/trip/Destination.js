/**
 * Created by Jeff Joneson on 7/10/2017.
 */
import React from "react"

import {Button, Col, Grid, Row} from "react-bootstrap"
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
      this.validationStateName()
    ]

    return !validations.some((result => String(result) !== "success"))
  }

  validationStateName = () => {
    if (!this.state.data.name) return 'error'
    if (this.state.data.name.length > 0) return 'success'
  }

  handleChange = (e) => {
    const newData = this.state.data
    newData[e.target.name] = e.target.value
    this.setState({data: newData})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data, edit: nextProps.edit})
  }

  save() {
    this.setState({edit: false})
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
              <Button bsStyle="primary" type="submit" block>Save</Button>
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
                                 name="date" type="date" edit={this.state.edit} onChange={this.handleChange}/>
          </Row>
          <Row>
            <DestinationFieldSet label="Location Type:" width={6} value={this.state.data.locationType}
                                 name="locationType" select={true}
                                 options={["City", "Restaurant"]}
                                 edit={this.state.edit} onChange={this.handleChange}/>
            <DestinationFieldSet label="Arrival:" width={3} value={this.state.data.arrival}
                                 name="arrival" type="time" edit={this.state.edit} onChange={this.handleChange}/>
            <DestinationFieldSet label="Departure:" width={3} value={this.state.data.departure}
                                 name="departure" type="time" edit={this.state.edit} onChange={this.handleChange}/>
            <DestinationFieldSet label="Url:" width={12} value={this.state.data.url}
                                 name="url" type="text" edit={this.state.edit} onChange={this.handleChange}/>
          </Row>
        </div>
      )
    }

    if (this.state.edit) return (
      <Grid className={"node" + (this.state.edit ? " node-write" : " node-read")}>
        <form onSubmit={this.handleSubmit}>
          {content()}
          {buttons()}
        </form>
      </Grid>
    )

    return (
      <Grid className={"node" + (this.state.edit ? " node-write" : " node-read")}>
        {content()}
        {buttons()}
      </Grid>
    )
  }
}
