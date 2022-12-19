import React from "react"
import "../styles/style.css"
import Square from "./Square"
import { nanoid } from 'nanoid'

function Main() {

    const [board, setBoard] = React.useState(createNewBoard())
    const [currentSquare, setCurrentSquare] = React.useState({x:0, y:0, isTakenBlack: false, isTakenWhite: false})
    const [turn, setTurn] = React.useState(true)

    console.log("Rendered Board");
    
    const boardElements = board.map(square => {
        return (
            <Square
            key = {square.id}
            x={square.x}
            y={square.y}
            isTakenWhite = {square.isTakenWhite}
            isTakenBlack = {square.isTakenBlack}
            onClick={() => placeCounter(square.id)}
            />
            )
    })

    React.useEffect(() => {

        console.log("turn = " + turn)
        setTurn(turn => !turn)
        console.log("Flipping function!")
        
        //write flipping mechanic in here
        checkForFlips();
    }, [board])

    function createNewBoard(){
        const squares = []
        for(let x=0;x<64;x++){
            squares.push({
                id: nanoid(),
                x:x%8,
                y:Math.floor(x/8),
                isTakenWhite:false,
                isTakenBlack:false
            })
        }
        return squares
    }

    //needs fixed since isnt affecting board state as its directly changing board variable not using setBoard
    function placeCounter(id){
        const tempBoard = [...board]
        for(let x=0;x<tempBoard.length;x++){
            if(id === tempBoard[x].id){
                if(!tempBoard[x].isTakenBlack && !tempBoard[x].isTakenWhite){
                    if(turn){
                        tempBoard[x].isTakenWhite = true;
                        setBoard(tempBoard)
                        setCurrentSquare({x:tempBoard[x].x,y:tempBoard[x].y, isTakenWhite:tempBoard[x].isTakenWhite, isTakenBlack:tempBoard[x].isTakenBlack})
                    } 
                    else { 
                        tempBoard[x].isTakenBlack = true;
                        setBoard(tempBoard)
                        setCurrentSquare({x:tempBoard[x].x,y:tempBoard[x].y, isTakenWhite:tempBoard[x].isTakenWhite, isTakenBlack:tempBoard[x].isTakenBlack})
                    }
                }
            }
        }
    }

    function checkForFlips(){
        checkTop()
        checkBottom()
    }

    function checkTop(){
        console.log("Checking Top")
        let tempBoard = [...board];
        //variable used to keep a check if every square between 2 white/black squares are the opposite colour. If not its set false and they squares don't flip!
        let spaceBetween = true;
        //variable used to keep a check if a check was made, ensures the method is not called repeatedly
        let line = false;
        let max = 0;
        console.log("Current square = " + currentSquare.x + ", " + currentSquare.y)
        if(turn){
            for(let x=0;x<tempBoard.length;x++){
                //has found square with same x coordinate and now must check both are same colour
                if(tempBoard[x].x === currentSquare.x && tempBoard[x].isTakenWhite === true && currentSquare.isTakenWhite === true && tempBoard[x].y < currentSquare.y){
                    spaceBetween = true;
                    line = false;
                    let min = tempBoard[x].y+1;
                    //loops for each space between found square and current square to check for different colour
                    for(let z=tempBoard[x].y+1;z<currentSquare.y;z++){
                        //get next square that is one down from top of board
                        let squareBetween = tempBoard.find(square => square.x === currentSquare.x && square.y === z)
                        //if these have a different colour from the current square and picked square then can flip
                        if(!squareBetween.isTakenBlack){
                            //can't be same colour so the line is broken and won't flip line
                            console.log("Square has colour "  + squareBetween.isTakenWhite)
                            console.log("Not a straight line or is broken")
                            spaceBetween = false;
                        } else {
                            line = true;
                        }
                    }
                    //if both squares inbetween are all the correct colour and a check has been made then flip the inbetween squares
                    if(spaceBetween && line){
                        setBoard(oldBoard => oldBoard.map(square => {
                            //if square has same x and is between last placed square and found top square then flip
                            return (square.x === currentSquare.x && square.y < currentSquare.y && square.y >= min)
                            ? {...square, isTakenWhite:true, isTakenBlack:false}
                            : square
                        }))
                        //this method changed board which causes turn to change an unwanted extra time, so we change it here to make it switch again back to the right turn
                        setTurn(turn => !turn)
                        return;
                    }
                    
                }
            }
        } else {
            for(let x=0;x<tempBoard.length;x++){
                //has found square with same x coordinate and now must check both are same colour
                if(tempBoard[x].x === currentSquare.x && tempBoard[x].isTakenBlack === true && currentSquare.isTakenBlack === true && tempBoard[x].y < currentSquare.y){
                    spaceBetween = true;
                    line = false;
                    let min = tempBoard[x].y+1;
                    //loops for each space between found square and current square to check for different colour
                    for(let z=tempBoard[x].y+1;z<currentSquare.y;z++){
                        //get next square that is one down from top of board
                        let squareBetween = tempBoard.find(square => square.x === currentSquare.x && square.y === z)
                        //if these have a different colour from the current square and picked square then can flip
                        if(!squareBetween.isTakenWhite){
                            //can't be same colour so the line is broken and won't flip line
                            spaceBetween = false;
                        } else {
                            line = true;
                        }
                    }
                    //if both squares inbetween are all the correct colour and a check has been made then flip the inbetween squares
                    if(spaceBetween && line){
                        setBoard(oldBoard => oldBoard.map(square => {
                            //if square has same x and is between last placed square and found top square then flip
                            return (square.x === currentSquare.x && square.y < currentSquare.y && square.y >= min)
                            ? {...square, isTakenWhite:false, isTakenBlack:true}
                            : square
                        }))
                        //this method changed board which causes turn to change an unwanted extra time, so we change it here to make it switch again back to the right turn
                        setTurn(turn => !turn)
                        return;
                    }
                    
                }
            }
        }   
    }

    function checkBottom(){
        console.log("Checking Bottom")
        let tempBoard = [...board];
        //variable used to keep a check if every square between 2 white/black squares are the opposite colour. If not its set false and they squares don't flip!
        let spaceBetween = true;
        //variable used to keep a check if a check was made, ensures the method is not called repeatedly
        let line = false;
        let max = 0;
        console.log("Current square = " + currentSquare.x + ", " + currentSquare.y)
        if(turn){
            for(let x=0;x<tempBoard.length;x++){
                //has found square with same x coordinate and now must check both are same colour
                if(tempBoard[x].x === currentSquare.x && tempBoard[x].isTakenWhite === true && currentSquare.isTakenWhite === true && tempBoard[x].y > currentSquare.y){
                    spaceBetween = true;
                    line = false;
                    let min = currentSquare.y+1;
                    //loops for each space between found square and current square to check for different colour
                    for(let z=currentSquare.y+1;z<tempBoard[x].y;z++){
                        //get next square that is one down from top of board
                        let squareBetween = tempBoard.find(square => square.x === currentSquare.x && square.y === z)
                        //if these have a different colour from the current square and picked square then can flip
                        if(!squareBetween.isTakenBlack){
                            //can't be same colour so the line is broken and won't flip line
                            console.log("Square has colour "  + squareBetween.isTakenWhite)
                            console.log("Not a straight line or is broken")
                            spaceBetween = false;
                        } else {
                            line = true;
                        }
                    }
                    //if both squares inbetween are all the correct colour and a check has been made then flip the inbetween squares
                    if(spaceBetween && line){
                        setBoard(oldBoard => oldBoard.map(square => {
                            console.log("min = " + min)
                            //if square has same x and is between last placed square and found top square then flip
                            return (square.x === currentSquare.x && square.y < tempBoard[x].y && square.y >= min)
                            ? {...square, isTakenWhite:true, isTakenBlack:false}
                            : square
                        }))
                        //this method changed board which causes turn to change an unwanted extra time, so we change it here to make it switch again back to the right turn
                        setTurn(turn => !turn)
                        return;
                    }
                    
                }
            }
        } else {
            for(let x=0;x<tempBoard.length;x++){
                //has found square with same x coordinate and now must check both are same colour
                if(tempBoard[x].x === currentSquare.x && tempBoard[x].isTakenBlack === true && currentSquare.isTakenBlack === true && tempBoard[x].y > currentSquare.y){
                    spaceBetween = true;
                    line = false;
                    let min = currentSquare.y+1;
                    //loops for each space between found square and current square to check for different colour
                    for(let z=currentSquare.y+1;z<tempBoard[x].y;z++){
                        //get next square that is one down from top of board
                        let squareBetween = tempBoard.find(square => square.x === currentSquare.x && square.y === z)
                        //if these have a different colour from the current square and picked square then can flip
                        if(!squareBetween.isTakenWhite){
                            //can't be same colour so the line is broken and won't flip line
                            spaceBetween = false;
                        } else {
                            line = true;
                        }
                    }
                    //if both squares inbetween are all the correct colour and a check has been made then flip the inbetween squares
                    if(spaceBetween && line){
                        setBoard(oldBoard => oldBoard.map(square => {
                            //if square has same x and is between last placed square and found top square then flip
                            return (square.x === currentSquare.x && square.y < tempBoard[x].y && square.y >= min)
                            ? {...square, isTakenWhite:false, isTakenBlack:true}
                            : square
                        }))
                        //this method changed board which causes turn to change an unwanted extra time, so we change it here to make it switch again back to the right turn
                        setTurn(turn => !turn)
                        return;
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