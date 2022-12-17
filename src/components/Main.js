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

    React.useEffect(() => {
        console.log("Flipping function!")
        setTurn(turn => !turn)
        //write flipping mechanic in here
    }, [board])

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
    
    //needs fixed since isnt affecting board state as its directly changing board variable not using setBoard
    function placeCounter(id){

        //will have to use map to affect board!
        //map function expected here
       
        //maybe also change board space prop to and x and y coordinate!
        const tempBoard = [...board]
        for(let x=0;x<tempBoard.length;x++){
            if(id === tempBoard[x].id){
                if(!tempBoard[x].isTakenBlack && !tempBoard[x].isTakenWhite){
                    if(turn){
                        tempBoard[x].isTakenWhite = true;
                        setBoard(tempBoard)
                    } 
                    else { 
                        tempBoard[x].isTakenBlack = true;
                        setBoard(tempBoard)
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