import React from "react"
import "../styles/style.css"

function Score(props) {

    return (
        <div className="score">
            <h2>White : Black </h2>
            <h2>{props.score.white} : {props.score.black}</h2>
        </div>
    );
}

export default Score;