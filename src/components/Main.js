import React from "react"
import "../styles/style.css"
import Square from "./Square"
import { nanoid } from 'nanoid'

function Main() {

    const [board, setBoard] = React.useState(createNewBoard())
    
    const boardElements = board.map(square => {
        return (
            <Square
            key = {square.id}
            space = {square.space}
            isTaken = {square.isTaken}
            />
            )
    })

    function createNewBoard(){
        const squares = []
        for(let x=0;x<64;x++){
            squares.push({
                id: nanoid,
                space:x,
                isTaken:true
            })
        }
        return squares
    }

    return (
        <main>
            <h1 className="title">Othello</h1>
            <div className="board-container">
                {boardElements}
            </div>
        </main>
    );
}

export default Main;