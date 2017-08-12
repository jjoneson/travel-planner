import React from "react"
import {Col, ControlLabel, FormGroup} from "react-bootstrap"
import {DestinationField} from "./DestinationField"

export class DestinationFieldSet extends React.Component {
  render() {
    const validationState = this.props.edit ? this.props.validationState : null
    return (
      <Col sm={this.props.width} smPush={this.props.push} smPull={this.props.pull}>
        <FormGroup validationState={validationState}>
          <ControlLabel>{this.props.label}</ControlLabel>
          <DestinationField name={this.props.name}
                            select={this.props.select}
                            options={this.props.options}
                            value={this.props.value}
                            onChange={this.props.onChange}
                            edit={this.props.edit}
                            type={this.props.type}
                            placeholder={this.props.placeholder}

          />
        </FormGroup>
      </Col>
    )
  }
}