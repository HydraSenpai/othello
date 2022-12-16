import React from "react"
import "../styles/style.css"
import Square from "./Square"
import { nanoid } from 'nanoid'

function Main() {

    const [board, setBoard] = React.useState(createNewBoard())
    const [turn, setTurn] = React.useState(true)

    console.log("Rendered Board");
    
    const boardElements = board.map(square => {
        return (
            <Square
            key = {square.id}
            space = {square.space}
            isTakenWhite = {square.isTakenWhite}
            isTakenBlack = {square.isTakenBlack}
            onClick={() => placeCounter(square.id)}
            />
            )
    })

    function createNewBoard(){
        const squares = []
        for(let x=0;x<64;x++){
            squares.push({
                id: nanoid(),
                space:x,
                isTakenWhite:false,
                isTakenBlack:false
            })
        }
        return squares
    }

    function placeCounter(id){
        for(let x=0;x<board.length;x++){
            if(id === board[x].id){
                if(!board[x].isTakenBlack && !board[x].isTakenWhite){
                    if(turn){
                        board[x].isTakenWhite = true;
                        setTurn(turn => !turn)
                    } 
                    else { 
                        board[x].isTakenBlack = true;
                        setTurn(turn => !turn)
                    }
                }
            }
        }
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