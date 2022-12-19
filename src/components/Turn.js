import React from "react"
import "../styles/style.css"

function Turn(props) {

    return (
        <div className="score">
            <h2>Turn: {props.currentTurn === true ? "White" : "Black"}</h2>
        </div>
    );
}

export default Turn;