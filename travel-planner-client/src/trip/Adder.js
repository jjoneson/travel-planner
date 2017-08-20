/**
 * Created by Jeff Joneson on 7/10/2017.
 */
import React from "react"
import {Button, Col, Grid, Row} from "react-bootstrap"
import {DestinationFieldSet} from "./DestinationFieldSet"

export class Adder extends React.Component {
  state = {
    nodeType: this.props.nodeType,
    edit: true
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (!this.valid()) return
    this.save()
  }

  valid = () => {
    const validations = [
      this.validationStateNodeType(),
    ]

    return !validations.some((result => String(result) !== "success"))
  }

  checkNull(prop) {
    if (!prop) return 'error'
    if (prop.length > 0) return 'success'
  }

  validationStateNodeType = () => this.checkNull(this.state.dest.nodeType)

  handleChange = (e) => {
    this.setState({nodeType: e.target.value})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({nodeType: nextProps.nodeType})
  }

  save() {
    this.setState({edit: false})
    this.props.addNode({dest: this.state.nodeType, edit: false},
      this.props.index)
  }

  addNode(nodeType) {
    this.props.addNode(nodeType)
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col sm={4} smPush={4} className="node node-read">
            <DestinationFieldSet onChange={this.handleChange} label="" width={12} value={this.state.nodeType}
                                 name="locationType" select={true}
                                 options={["Destination", "Flight", "Ground Transport"]}
                                 edit={true}/>
            <Button bsStyle="default" block onClick={() => this.props.addNode(this.state.nodeType)}>
              Add
            </Button>
          </Col>
        </Row>
      </Grid>
    )
  }
}
