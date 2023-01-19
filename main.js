const board = document.querySelector('#GameBoard')
const warnBox = document.querySelector('#warn')
const ResBtn = document.querySelector('#Restart')
const CB = document.querySelector('#Computer')
const HB = document.querySelector('#Human')
// 0 = Vs Comp; 1 = Vs Human;
let GameType = 1;
let TTTBoard = [[0,0,0],[0,0,0],[0,0,0]];
let Players= [];
// 0 = false, 1 = O, 2 = 1, 3 = Tie 
let WinStat = 0;



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
        if (CellValidate(row,column) === true) {
            let pc = currentPlayer.pcode
            TTTBoard[row][column] = pc
            if (pc === 1) {
                targ.innerHTML = 'O'
                currentPlayer = Players[1]
            }
            else {
                targ.innerHTML = 'X'
                currentPlayer = Players[0]
            }
        }
        else {
            warnBox.innerHTML = "Another Player has used this spot"
            warnBox.style.visibility = 'visible'
        }
        CheckWin()
        if (WinStat === 1) {
            board.style.display = 'none'
            warnBox.innerHTML = "Player 1 has won"
            warnBox.style.visibility = 'visible'
        }
        if (WinStat === 2) {
            board.style.display = 'none'
            warnBox.innerHTML = "Player 2 has won"
            warnBox.style.visibility = 'visible'
        }
        if (WinStat === 3) {
            board.style.display = 'none'
            warnBox.innerHTML = "It is a Tie"
            warnBox.style.visibility = 'visible'
        }
    })
    board.appendChild(cell);
}

function CheckWin() {
    if (LineCheck(1) === true || ColumnCheck(1) === true || DiaCheck(1) === true) {
        WinStat = 1
    }
    if (LineCheck(2) === true || ColumnCheck(2) === true || DiaCheck(2) === true) {
        WinStat = 2
    }
    if (TieCheck() === true) {
        WinStat = 3
    }
}

function TieCheck() {
    let stat = 0;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++){
            if (TTTBoard[i][j] !== 0) {
                stat++
                if (stat === 9) {
                    return true
                }
            }
        }
    }
    return false
}

function LineCheck(a) {
    let stat = 0;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++){
            if (TTTBoard[i][j] === a) {
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

function ColumnCheck(a) {
    if (TTTBoard[0][0] === a &&
        TTTBoard[1][0] === a &&
        TTTBoard[2][0] === a)
        return true
    if (TTTBoard[0][1] === a &&
        TTTBoard[1][1] === a &&
        TTTBoard[2][1] === a)
        return true
    if (TTTBoard[0][2] === a &&
        TTTBoard[1][2] === a &&
        TTTBoard[2][2] === a)
        return true
    return false
}

function DiaCheck(a) {
    if (TTTBoard[0][0] === a && TTTBoard[1][1] === a && TTTBoard[2][2] === a) {
        return true
    }
    if (TTTBoard[0][2] === a && TTTBoard[1][1] === a && TTTBoard[2][0] === a) {
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
    WinStat = 0
}