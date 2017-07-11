import React from "react";
import ReactDOM from "react-dom";
import "./site.css";
import $ from "jquery";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {Node} from "./Node.js";
import {Button, Col, Grid, Row} from "react-bootstrap";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

global.UP = "up";
global.DOWN = "down";


class Trip extends React.Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
    };
  }

  render() {
    const nodes = this.state.nodes
      .map(function (node, i) {
        const prev = this.state.nodes[i - 1];
        node.arrival = prev && prev.departure ? prev.departure : node.arrival;
        node.date = prev && prev.date ? overnight(prev) ? addDays(prev.date, 1) : prev.date : node.date;
        return <div key={i}>
          <Node
            data={node}
            save={(data, i) => this.saveNode(data, i)}
            move={(direction, i) => this.moveNode(direction, i)}
            insertNode={(i) => this.insertNode(i)}
            delete={this.deleteNode.bind(this, i)}
            index={i}
          />
        </div>;
      }, this);
    return (
      <div>
        {nodes}
        <Adder onClick={this.addNewNode.bind(this)}/>
      </div>

    );
  }

  componentDidMount() {
    this.addNewNode();
  }

  insertNode(i) {
    const newNodes = this.state.nodes.slice();
    const prev = newNodes[i - 1];
    newNodes.splice(i + 1, 0, {
      date: prev && prev.date ? overnight(prev) ? addDays(prev.date, 1) : prev.date : new Date().toJSON().slice(0, 10),
      arrival: prev && prev.departure ? prev.departure : "12:00",
      edit: true
    });
    this.setState({
      nodes: newNodes
    });
  }

  addNewNode() {
    const newNodes = this.state.nodes.slice();
    const prev = newNodes[newNodes.length - 1];
    newNodes.push({
      date: prev && prev.date ? overnight(prev) ? addDays(prev.date, 1) : prev.date : new Date().toJSON().slice(0, 10),
      arrival: prev && prev.departure ? prev.departure : "12:00",
      edit: true
    });
    this.setState({
      nodes: newNodes
    });
  }

  moveNode(direction, i) {
    const newNodes = this.state.nodes.slice();
    const j = direction === global.UP ? i - 1 : i + 1;
    if (!newNodes[j]) {
      return;
    }
    const c = newNodes[i];
    const c_arrival = c.arrival;
    const c_departure = c.departure;
    const o_arrival = newNodes[j].arrival;
    const o_departure = newNodes[j].departure;
    newNodes[i] = newNodes[j];
    newNodes[j] = c;
    newNodes[i].arrival = c_arrival;
    newNodes[i].departure = c_departure;
    newNodes[j].arrival = o_arrival;
    newNodes[j].departure = o_departure;
    this.setState({nodes: newNodes});
  }

  deleteNode(i) {
    const newNodes = this.state.nodes.slice();
    newNodes.splice(i, 1);
    this.setState({nodes: newNodes});
  }

  saveNode(data, i) {
    const newNodes = this.state.nodes.slice();
    newNodes[i] = data;
    newNodes.splice(i, 1, newNodes[i]);
    this.setState({nodes: newNodes});
  }
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
  );
}

function overnight(prev) {
  return (
  prev &&
  prev.arrival &&
  prev.departure &&
  prev.arrival.slice(0, 2) > prev.departure.slice(0, 2));
}

function addDays(date, days) {
  let d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toJSON().slice(0, 10);
}

// ========================================

ReactDOM
  .render(
    <Trip />,
    document
      .getElementById(
        'root'
      )
  );

