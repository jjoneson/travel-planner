/**
 * Created by Jeff Joneson on 7/10/2017.
 */
import React from "react";
import {Button, Col, ControlLabel, FormControl, FormGroup, Glyphicon, Grid, Row} from "react-bootstrap";

export class Node extends React.Component {
  constructor(props) {
    super();
    this.state = {
      name: props.data.name,
      arrival: props.data.arrival,
      departure: props.data.arrival,
      url: "",
      locationType: "City",
      date: props.data.date,
      edit: props.data.edit
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        name: nextProps.data.name,
        arrival: nextProps.data.arrival,
        departure: nextProps.data.departure,
        url: nextProps.data.url,
        locationType: nextProps.data.locationType,
        date: nextProps.data.date,
        edit: nextProps.data.edit
      }
    )
  }

  save() {
    this.setState({edit: false});
    this.props.save({
      name: this.state.name,
      arrival: this.state.arrival,
      departure: this.state.departure,
      url: this.state.url,
      locationType: this.state.locationType,
      date: this.state.date,
      edit: !this.state.edit,
    }, this.props.index);
  }

  deleteThis(i) {
    this.props.delete(i);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return this.state.edit ? this.renderWrite() : this.renderRead();
  }

  renderFieldset(fieldname, width, field) {
    return (
      <Col sm={width}>
        <FormGroup>
          <ControlLabel>{fieldname}</ControlLabel>
          {field}
        </FormGroup>
      </Col>
    );
  }

  renderField(name, type, val) {
    return (
      <FormControl
        name={name}
        type={type}
        value={val}
        onChange={this.handleChange}/>
    );
  }

  renderText(name, val, width) {
    return (
      <Col sm={width}>
        <FormGroup>
          <ControlLabel>{name}</ControlLabel>
          <p>{val}</p>
        </FormGroup>
      </Col>
    );
  }

  renderLocationTypeSelect(name, val) {
    return (
      <FormControl
        componentClass="select"
        name={name}
        value={val}
        onChange={this.handleChange}
      >
        <option>City</option>
        <option>Destination</option>
      </FormControl>
    )
  }

  renderHeaderWrite() {
    return (
      <Row>
        {
          this.renderFieldset("Name:", 6,
            this.renderField("name", "text", this.state.name))
        }
        {
          this.renderFieldset("Date:", 6,
            this.renderField("date", "date", this.state.date))
        }
      </Row>
    )
  }

  renderHeaderRead() {
    return (
      <Row className="header-row">
        <Col sm={6}>
          <ControlLabel>{this.state.name}</ControlLabel>
        </Col>
        <Col sm={6}>
          <span>{this.state.date}</span>
        </Col>
      </Row>
    )
  }

  renderWrite() {
    return (
      <Grid className="node node-write">
        {this.renderHeaderWrite()}
        <Row>
          {
            this.renderFieldset("Location Type:", 6,
              this.renderLocationTypeSelect("locationType", this.state.locationType))
          }
          {
            this.renderFieldset("Arrival:", 3,
              this.renderField("arrival", "time", this.state.arrival))
          }
          {
            this.renderFieldset("Departure:", 3,
              this.renderField("departure", "time", this.state.departure))
          }
          {
            this.renderFieldset("Url:", 12,
              this.renderField("url", "text", this.state.url))
          }
        </Row>
        <Row>
          <Col sm={2} smPush={4}>
            <Button
              bsStyle="primary"
              block
              onClick={this.save.bind(this)}>
              Save
            </Button>
          </Col>
          <Col sm={2} smPush={4}>
            <Button
              bsStyle="danger"
              block
              onClick={this.deleteThis.bind(this)}>
              Delete
            </Button>
          </Col>
        </Row>
      </Grid>
    )
  }

  renderRead() {
    return (
      <Grid className="node node-read">
        <Button bsSize="xsmall" onClick={() => this.props.move(global.UP, this.props.index)}>
          <Glyphicon glyph="arrow-up"/>
        </Button>
        <Button bsSize="xsmall" onClick={() => this.props.move(global.DOWN, this.props.index)}>
          <Glyphicon glyph="arrow-down"/>
        </Button>
        {this.renderHeaderRead()}
        <Row>
          {
            this.renderText("Location Type:", this.state.locationType, 3)
          }
          {
            this.renderText("Arrival:", this.state.arrival, 3)
          }
          {
            this.renderText("Departure:", this.state.departure, 3)
          }
          {
            this.renderText("Url:", this.state.url, 12)
          }
        </Row>
        <Row>
          <Col sm={2} smPush={4}>
            <Button
              block
              bsStyle="primary"
              onClick={() => this.setState({edit: true})}>
              Edit
            </Button>
          </Col>
          <Col sm={2} smPush={4}>
            <Button
              block
              bsStyle="default"
              onClick={() => this.props.insertNode(this.props.index)}>
              Insert Dest
            </Button>
          </Col>
        </Row>
      </Grid>
    )
  }
}
