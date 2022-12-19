import React from "react"
import "../styles/style.css"

function Square(props) {

    const styles = {
        backgroundColor: props.isTakenBlack ? "black" : props.isTakenWhite ? "white" : ""
    }

    return (
        <div className="square" style={styles} onClick={props.onClick}>
            {props.x} + {props.y}
        </div>
    );
}

export default Square;