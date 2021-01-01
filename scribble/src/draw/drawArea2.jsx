import React, { Component } from 'react'
import CanvasDraw from "react-canvas-draw";

class drawArea2 extends Component {
  save() {
    console.log("run")
    sessionStorage.setItem(
      "savedDrawing",
      this.loadableCanvas.getSaveData()
    );
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.save);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.save);
    sessionStorage.clear()
  }

  render() {
    return (
      <div>
        <CanvasDraw
          canvasWidth={2000}
          canvasHeight={2000}
          ref={canvasDraw => (this.loadableCanvas = canvasDraw)}
          saveData={sessionStorage.getItem("savedDrawing")}
        />
      </div>
    )
  }
}

export default drawArea2