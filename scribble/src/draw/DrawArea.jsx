import React, { Component } from 'react'
import { List, Map } from 'immutable'

import socketClient from "socket.io-client";

const SERVER = "http://localhost:8080"
var socket = socketClient(SERVER);
socket.on('connection', () => {
  console.log(`Connected with the backend`);
});

class DrawArea extends Component {
  constructor() {
    super();

    this.state = {
      lines: new List(),
      //lines: []
      isDrawing: false
    }

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  // Ctrl-Z undo previous line
  undo = e => {
    if (e.ctrlKey && e.keyCode === 90) {
      this.setState(prevState => ({
        lines: prevState.lines.pop()
      }))
    }
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("keydown", this.undo);

    /* var a = new List([1, 2, 3])
    var b = new List([4, 5, 6])
    console.log(a.merge(baaaaaaaaa)) */

    var prevLines = sessionStorage.getItem("strokes")
    prevLines = List(JSON.parse(prevLines))

    var updatedLines = []
    prevLines.forEach(line => (
      updatedLines.push(new List(
        line.forEach(point => (
          Map(point)
        ))
      ))
    ))
    /* prevLines.forEach(line => (
      line.forEach(point => console.log(Map(point)))
    )) */

    updatedLines = List(updatedLines)

    //var b = new List()
    //var c = b.merge(updatedLines)

    console.log(updatedLines)
    //console.log(b.merge(updatedLines))
    //console.log(List.isList(List(prevLines)))

    /* this.setState(prevState => ({
      lines: prevState.lines.merge(updatedLines)
    })) */
    /* if (this.state.lines.isEmpty()) {
      this.setState({
        lines: c
      })
    } */

    /* if (this.state.lines.isEmpty() && prevLines !== null) {
      console.log("running")
      this.setState(prevState => ({
        lines: [...prevState.lines, prevLines]
      }))

      this.setState({
        lines: prevLines
      })aa
    } */
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("keydown", this.undo);

    // only add if lines is not empty
    if (!this.state.lines.isEmpty()) {
      sessionStorage.setItem("strokes", JSON.stringify(this.state.lines));
    }
  }

  /* componentDidUpdate(prevState) {
    if (!this.state.lines.equals(prevState.lines)) {
      socket.on("strokes", (lines) => {
        this.setState(prevState => ({
          lines: prevState.lines.concat(new List(lines))
        }))
      })
    }
  } */

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    console.log(this.state.lines)

    /* if (!this.state.lines.isEmpty()) {
      socket.emit("strokes", JSON.stringify(this.state.lines))
    } */

    this.setState(prevState => ({
      lines: prevState.lines.push(new List([point])),
      isDrawing: true
    }));
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState(prevState => ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
    }));
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });

    /* socket.on("strokes", (lines) => {
      var updatedLines = []
      lines.forEach(line => (
        updatedLines.push(List(line))
      ))

      updatedLines = List(updatedLines)

      this.setState(prevState => ({
        lines: prevState.lines.concat(updatedLines)
      }))
      //console.log(lines)
      this.setState({
        lines: List(lines)
      })
    }) */
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  render() {
    return (
      <div
        className="drawArea"
        ref="drawArea"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
      >
        <Drawing lines={this.state.lines} />
      </div>
    );
  }
}

function Drawing({ lines }) {
  return (
    <svg className="drawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} />
      ))}
    </svg>
  );
}

function DrawingLine({ line }) {
  const pathData = "M " +
    line
      .map(p => {
        return `${p.get('x')} ${p.get('y')}`;
      })
      .join(" L ");

  return <path className="path" d={pathData} />;
}

export default DrawArea;