import React from "react"
import "../styles/style.css"
import Square from "./Square"
import Score from "./Score"
import Turn from "./Turn"
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
        checkForFlips();
    }, [board])

    function createNewBoard(){
        const squares = []
        for(let x=0;x<64;x++){
            if(x===27 || x===36){
              squares.push({
                id: nanoid(),
                x:x%8,
                y:Math.floor(x/8),
                isTakenWhite:true,
                isTakenBlack:false
            })  
            }
            else if(x===28 || x===35){
                squares.push({
                    id: nanoid(),
                    x:x%8,
                    y:Math.floor(x/8),
                    isTakenWhite:false,
                    isTakenBlack:true
            }) 
            } else {
                squares.push({
                id: nanoid(),
                x:x%8,
                y:Math.floor(x/8),
                isTakenWhite:false,
                isTakenBlack:false
            })
            }
            
        }
        return squares
    }

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
        checkLeft()
        checkRight()
    }

    function checkTop(){
        console.log("Checking Top")
        let tempBoard = [...board];
        //variable used to keep a check if every square between 2 white/black squares are the opposite colour. If not its set false and they squares don't flip!
        let spaceBetween = true;
        //variable used to keep a check if a check was made, ensures the method is not called repeatedly
        let line = false;
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

    function checkLeft(){
        console.log("Checking Left")
        let tempBoard = [...board];
        //variable used to keep a check if every square between 2 white/black squares are the opposite colour. If not its set false and they squares don't flip!
        let spaceBetween = true;
        //variable used to keep a check if a check was made, ensures the method is not called repeatedly
        let line = false;
        console.log("Current square = " + currentSquare.x + ", " + currentSquare.y)
        if(turn){
            for(let x=0;x<tempBoard.length;x++){
                //has found square with same x coordinate and now must check both are same colour
                if(tempBoard[x].y === currentSquare.y && tempBoard[x].isTakenWhite === true && currentSquare.isTakenWhite === true && tempBoard[x].x < currentSquare.x){
                    spaceBetween = true;
                    line = false;
                    let min = currentSquare.x;
                    //loops for each space between found square and current square to check for different colour
                    for(let z=tempBoard[x].x+1;z<currentSquare.x;z++){
                        //get next square that is one down from top of board
                        let squareBetween = tempBoard.find(square => square.y === currentSquare.y && square.x === z)
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
                            return (square.y === currentSquare.y && square.x > tempBoard[x].x && square.x < min)
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
                if(tempBoard[x].y === currentSquare.y && tempBoard[x].isTakenBlack === true && currentSquare.isTakenBlack === true && tempBoard[x].x < currentSquare.x){
                    spaceBetween = true;
                    line = false;
                    let min = currentSquare.x;
                    //loops for each space between found square and current square to check for different colour
                    for(let z=tempBoard[x].x+1;z<currentSquare.x;z++){
                        //get next square that is one down from top of board
                        let squareBetween = tempBoard.find(square => square.y === currentSquare.y && square.x === z)
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
                            return (square.y === currentSquare.y && square.x > tempBoard[x].x && square.x < min)
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

    function checkRight(){
        console.log("Checking Right")
        let tempBoard = [...board];
        //variable used to keep a check if every square between 2 white/black squares are the opposite colour. If not its set false and they squares don't flip!
        let spaceBetween = true;
        //variable used to keep a check if a check was made, ensures the method is not called repeatedly
        let line = false;
        console.log("Current square = " + currentSquare.x + ", " + currentSquare.y)
        if(turn){
            for(let x=0;x<tempBoard.length;x++){
                //has found square with same x coordinate and now must check both are same colour
                if(tempBoard[x].y === currentSquare.y && tempBoard[x].isTakenWhite === true && currentSquare.isTakenWhite === true && tempBoard[x].x > currentSquare.x){
                    spaceBetween = true;
                    line = false;
                    let min = currentSquare.x;
                    //loops for each space between found square and current square to check for different colour
                    for(let z=currentSquare.x+1;z<tempBoard[x].x;z++){
                        //get next square that is one down from top of board
                        let squareBetween = tempBoard.find(square => square.y === currentSquare.y && square.x === z)
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
                            return (square.y === currentSquare.y && square.x <= tempBoard[x].x-1 && square.x > min)
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
                if(tempBoard[x].y === currentSquare.y && tempBoard[x].isTakenBlack === true && currentSquare.isTakenBlack === true && tempBoard[x].x > currentSquare.x){
                    spaceBetween = true;
                    line = false;
                    let min = currentSquare.x;
                    //loops for each space between found square and current square to check for different colour
                    for(let z=currentSquare.x+1;z<tempBoard[x].x;z++){
                        //get next square that is one down from top of board
                        let squareBetween = tempBoard.find(square => square.y === currentSquare.y && square.x === z)
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
                            return (square.y === currentSquare.y && square.x <= tempBoard[x].x-1 && square.x > min)
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

    function calculateScore(){
        let blackScore = 0
        let whiteScore = 0
        for(let x=0;x<board.length;x++){
            if(board[x].isTakenBlack){
                blackScore++;
            } else if (board[x].isTakenWhite){
                whiteScore++;
            }
        }
        return {black:blackScore, white:whiteScore}
    }
    
    return (
        <main>
            <h1 className="title">Othello</h1>
            <Score score={calculateScore()}/>
            <div className="board-container">
                {boardElements}
            </div>
            <Turn currentTurn={turn}/>
        </main>
    );
}

export default Main;