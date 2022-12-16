import React from "react"
import "../styles/style.css"

function Square(props) {
  return (
    <div className="square">
        {props.space}
    </div>
  );
}

export default Square;