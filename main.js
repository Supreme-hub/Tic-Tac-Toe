const board = document.querySelector('#GameBoard')
const warnBox = document.querySelector('#warn')
const ResBtn = document.querySelector('#Restart')
const CB = document.querySelector('#Computer')
const HB = document.querySelector('#Human')
// 0 = Vs Comp; 1 = Vs Human;
let GameType = 0;
let TTTBoard = [[0,0,0],[0,0,0],[0,0,0]];
let Players= [];
// 0 = false, 1 = O, 2 = 1, 3 = Tie 
let WinStat;
let turn;


function CellValidate(m,n) {
    if (TTTBoard[m][n] === 0) {
        return true
    }
    else {
        return false
    }
}

const GameBoard = (()=> {
    for (i = 0; i<3;i++) {
        for (j = 0; j<3; j++) {
            CreateCell(i,j)
        }
    }
} ) ();

const PlayerM = (pcode, type) => {
    // pcode 1 = 'O'; pcode 2 = 'X'
    // type 0 = human; type 1 = computer
    return {pcode, type};
}

const GameCells = document.querySelectorAll('.BoxCell')

GameStart()

currentPlayer = Players[0];

function CreateCell(a,b) {
    let cell = document.createElement('div')
    cell.setAttribute('data-row', a)
    cell.setAttribute('data-col', b)
    cell.classList.add('BoxCell')
    cell.addEventListener('click', (e) => {
        warnBox.style.visibility = 'collapse'
        let targ = e.target
        let row = targ.getAttribute('data-row')
        let column = targ.getAttribute('data-col')
        let k = 0
        if (CellValidate(row,column) === true) {
            let pc = currentPlayer.pcode
            TTTBoard[row][column] = pc
            if (pc === 1) {
                targ.innerHTML = 'O'
                if (GameType === 1) {
                    currentPlayer = Players[1]
                }
            }
            if (pc === 2) {
                targ.innerHTML = 'X'
                currentPlayer = Players[0]
            }
            turn++
            k =0
        }
        else {
            warnBox.innerHTML = "Another Player has used this spot"
            warnBox.style.visibility = 'visible'
            k =1
        }
        CheckWin(TTTBoard)
        if (WinStat === -10) {
            board.style.display = 'none'
            warnBox.innerHTML = "Player 1 has won"
            warnBox.style.visibility = 'visible'
        }
        if (WinStat === 10) {
            board.style.display = 'none'
            warnBox.innerHTML = "Player 2 has won"
            warnBox.style.visibility = 'visible'
        }
        if (TieCheck(TTTBoard) === true) {
            board.style.display = 'none'
            warnBox.innerHTML = "It is a Tie"
            warnBox.style.visibility = 'visible'
        }
        if (GameType === 0 && k === 0) {
            ComputerMove(TTTBoard)
            turn++
            CheckWin(TTTBoard)
            if (WinStat === -10) {
                board.style.display = 'none'
                warnBox.innerHTML = "Player 1 has won"
                warnBox.style.visibility = 'visible'
            }
            if (WinStat === 10) {
                board.style.display = 'none'
                warnBox.innerHTML = "Player 2 has won"
                warnBox.style.visibility = 'visible'
            }
            if (TieCheck(TTTBoard) === true) {
                board.style.display = 'none'
                warnBox.innerHTML = "It is a Tie"
                warnBox.style.visibility = 'visible'
            }
        }
    })
    board.appendChild(cell);
}

function ComputerMove(currentBoard) {
    let move = getBestMove(currentBoard)
    let a = move[0]
    let b = move[1]
    currentBoard[a][b] = 2
    let cell = document.querySelector(`[data-row="${a}"][data-col="${b}"]`)
    cell.innerHTML = "X"
}

function getBestMove(currentBoard) {
    let bestVal = +Infinity
    let bestMove = [-1,-1]
    
    for (let i=0;i<3;i++) {
        for(let j=0;j<3;j++) {
            if (currentBoard[i][j] === 0) {
                let temp = currentBoard[i][j]
                currentBoard[i][j] = 1
                let moveVal = minMax(currentBoard,0, true)
                currentBoard[i][j] = temp   
                if (moveVal < bestVal) {
                    bestMove = [i,j]
                    bestVal = moveVal
                }
            }
        }
    }
    return bestMove
}

function minMax(currentBoard, depth, isMaximizing) {
    let currentStat = CheckWin(currentBoard)
    if (currentStat === 10) {
        return currentStat - depth
    }
    if (currentStat === -10) {
        return currentStat + depth
    }
    if (TieCheck(currentBoard) === true) {
        return 0
    }

    if(isMaximizing) {
        let maxEval = -1000
        for (let i = 0; i<3;i++) {
            for (let j =0; j < 3; j++) {
                if (currentBoard[i][j] === 0) {
                    let temp = currentBoard[i][j]
                    currentBoard[i][j] = 2
                    let val = minMax(currentBoard, depth+1, false)
                    currentBoard[i][j] = temp
                    if (val > maxEval) {
                        maxEval = val;
                    }
                }   
            }
        }
        return maxEval
    } else { 
        let minEval = +1000
        for (let i = 0; i<3;i++) {
            for (let j=0;j<3;j++) {
                if (currentBoard[i][j] === 0) {
                    let temp = currentBoard[i][j]
                    currentBoard[i][j] = 1
                    let val = minMax(currentBoard, depth+1, true)
                    currentBoard[i][j] = temp

                    if (val < minEval) {
                        minEval = val;
                    }
                }
            }
        }
        return minEval
    }
}

function CheckWin(currentBoard) {
    WinStat = 0;
    if (LineCheck(1,currentBoard) === true || ColumnCheck(1,currentBoard) === true || DiaCheck(1,currentBoard) === true) {
        WinStat = -10
    }
    else
    if (LineCheck(2,currentBoard) === true || ColumnCheck(2,currentBoard) === true || DiaCheck(2,currentBoard) === true) {
        WinStat = 10
    }
    else
    if (TieCheck(currentBoard) === true) {
        WinStat = 0
    }
    
    return WinStat
}

function TieCheck(currentBoard) {
    let stat = 0;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++){
            if (currentBoard[i][j] !== 0) {
                stat++
                if (stat === 9) {
                    return true
                }
            }
        }
    }
    return false
}

function LineCheck(a,currentBoard) {
    let stat = 0;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++){
            if (currentBoard[i][j] === a) {
                stat++
                if (stat === 3) {
                    return true
                }
            }
        }
        stat = 0;
    }
    return false
} 

function ColumnCheck(a,currentBoard) {
    if (currentBoard[0][0] === a &&
        currentBoard[1][0] === a &&
        currentBoard[2][0] === a)
        return true
    if (currentBoard[0][1] === a &&
        currentBoard[1][1] === a &&
        currentBoard[2][1] === a)
        return true
    if (currentBoard[0][2] === a &&
        currentBoard[1][2] === a &&
        currentBoard[2][2] === a)
        return true
    return false
}

function DiaCheck(a,currentBoard) {
    if (currentBoard[0][0] === a && currentBoard[1][1] === a && currentBoard[2][2] === a) {
        return true
    }
    if (currentBoard[0][2] === a && currentBoard[1][1] === a && currentBoard[2][0] === a) {
        return true
    }
    return false
}

CB.addEventListener('click', () => {
    CB.style.color = "rgb(190, 186, 186)"
    HB.style.color = "rgb(243, 237, 237)"
    GameType = 0;
    GameStart()
})

HB.addEventListener('click', () => {
    HB.style.color = "rgb(190, 186, 186)"
    CB.style.color = "rgb(243, 237, 237)"
    GameType = 1;
    GameStart()
})

ResBtn.addEventListener('click', () => {
    GameStart();
})

function GameStart() {
    TTTBoard = [[0,0,0],[0,0,0],[0,0,0]];
    for (i = 0; i<9;i++) {
        GameCells[i].innerHTML = '';
    }
    if (Players.length !== 0) {
        Players.length = 0
    }
    if (GameType === 1) {
        Pf = PlayerM(1, 0)
        Players.push(Pf)
        Pf = PlayerM(2, 0)
        Players.push(Pf)
    }
    else {
        Pf = PlayerM(1, 0)
        Players.push(Pf)
        Pf = PlayerM(2, 1)
        Players.push(Pf)
    }
    warnBox.style.visibility = 'collapse'
    board.style.display = 'grid'
    WinStat = null
    currentPlayer = Players[0]
    turn = 0;
}