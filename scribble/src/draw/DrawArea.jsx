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
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("keydown", this.undo);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

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