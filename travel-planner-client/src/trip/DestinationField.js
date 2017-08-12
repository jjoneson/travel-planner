import React from "react"
import {FormControl} from "react-bootstrap"

export class DestinationField extends React.Component {
  render() {
    if (!this.props.edit) {
      return (
        <p>{this.props.value}</p>
      )
    }

    if (this.props.select) {
      const options = this.props.options.map(function (option) {
        return <option key={option}>{option}</option>
      })

      return (
        <FormControl componentClass="select" name={this.props.name} value={this.props.value}
                     onChange={this.props.onChange}>
          {options}
        </FormControl>
      )
    }

    if (this.props.type == "textarea") {
      return (
        <FormControl componentClass="textarea" name={this.props.name} type={this.props.type} value={this.props.value}
                     onChange={this.props.onChange}/>
      )
    }

    return (
      <FormControl placeholder={this.props.placeholder} name={this.props.name} type={this.props.type}
                   value={this.props.value}
                   onChange={this.props.onChange}/>
    )
  }
}