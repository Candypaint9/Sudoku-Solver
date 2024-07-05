let boardSize = 450;
let cellSize = boardSize/9;
let board = [];
let yOffset = 50;

let selectedx = -1;
let selectedy = -1;

let clearButton;
let solveButton;

let rowMask;
let colMask;
let boxMask;

let orderToFill;
let possibleNumFill;

let givenValues;


function setup()
{
    var canvas = createCanvas(boardSize, boardSize);
    canvas.position(windowWidth/2 - boardSize/2, windowHeight/2 - boardSize/2 - yOffset);

    //setting the board
    for(let i = 0; i < 9; i++)
    {
        let temp = [];
        for(let j=0; j<9; j++)
        {
            temp.push(0);
        }
        board.push(temp);
    }

    //buttons
    solveButton = createButton("Solve");
    solveButton.size(100, 50);
    solveButton.position(windowWidth/2 - solveButton.width*3/2, windowHeight*5/6);
    solveButton.mousePressed(onSolveButtonPress);

    clearButton = createButton("Clear");
    clearButton.size(100, 50);
    clearButton.position(windowWidth/2 + solveButton.width/2, windowHeight*5/6);
    clearButton.mousePressed(clearBoard);

    createGivenValues();
}  




function mouseClicked()
{
    selectedx = floor(mouseX / cellSize);
    selectedy = floor(mouseY / cellSize);
}


function onSolveButtonPress()
{
    hideButtons();
    solve();
    showButtons();
}

function updateGivenValues(i, j, num)
{
    givenValues[i.toString().concat(j.toString())] = num;
}


function createGivenValues()
{
    givenValues = {};
    for(let i=0; i<9; i++)
    {
        for(let j=0; j<9; j++)
        {
            givenValues[i.toString().concat(j.toString())] = 0;
        }
    }
}


function clearBoard()
{
    for(let i = 0; i < 9; i++)
    {
        for(let j=0; j<9; j++)
        {
            board[i][j] = 0;
        }
    }
    
    createGivenValues();
}


function chkSelectedOnBoard()
{
    if (selectedx >= 0 && selectedx < 9 && selectedy >= 0 && selectedy < 9) {
        return true;
    }
    return false;
}

function updateCellValue()
{
    if (keyIsPressed && chkSelectedOnBoard()) {
        board[selectedy][selectedx] = int(key);
        updateGivenValues(selectedy, selectedx, int(key));
    }
}


function drawBoard()
{
    //vertical lines
    for(let i=1; i<9; i++)
        {
            if (i%3 == 0){
                strokeWeight(4);
                stroke(170);
            }
            else{
                strokeWeight(2);
                stroke(135);
            }

            line(i*cellSize, 0, i*cellSize, boardSize);
        }
        //horizontal lines
        for(let i=1; i<9; i++)
        {
            if(i%3 == 0){
                strokeWeight(4);
                stroke(170)
            }
            else{
                strokeWeight(2);
                stroke(135);
            }

            line(0, i*cellSize, boardSize, i*cellSize);
        }

        //drawing given numbers
        textAlign(CENTER, CENTER);
        textSize(18);
        for(let i=0; i<9; i++)
        {
            for(let j=0; j<9; j++)
            {
                noStroke();

                //filling the numbers
                if (board[i][j] == 0) {
                    continue;
                }
                fill(160, 6, 105);
                if (givenValues[i.toString().concat(j.toString())]) {
                    fill(0);
                }

                text(board[i][j], (j+0.5)*cellSize, (i+0.5)*cellSize);
            }
        }

        fill(0, 255, 0, 100);
        rect(selectedx*cellSize, selectedy*cellSize, cellSize, cellSize);
        fill(0);
}



function draw()
{
    updateCellValue();

    background(100);
    drawBoard();
}


function hideButtons()
{
    clearButton.hide();
    solveButton.hide();
}

function showButtons()
{
    clearButton.show(); 
    solveButton.show();  
}



// SOLVING FUNCTIONS

function createOrder()
{
    orderToFill = new Array();
    possibleNumFill = {};

    for(let i=0; i<9; i++)
    {
        for(let j=0; j<9; j++)
        {
            if(board[i][j])
            {
                continue;
            }

            var numPossible = 0;
            for(let k=1; k<=9; k++)
            {
                if(chkValid(i, j, k))
                {
                    numPossible++;
                }
            }

            possibleNumFill[i.toString().concat(j.toString())] = numPossible;
            orderToFill.push(i.toString().concat(j.toString()));
        }
    }

    orderToFill.sort(function(x, y)
    {
        if(possibleNumFill[x] >= possibleNumFill[y])
        {
            return 1;
        }
        else if(possibleNumFill[x] < possibleNumFill[y])
        {
            return -1;
        }
    });
}

function addToMask(i, j, num)
{
    rowMask[j] |= 1 << num;
    colMask[i] |= 1 << num;
    boxMask[Math.floor(i/3)*3 + Math.floor(j/3)] |= 1 << num;
}

function removeFromMask(i, j, num)
{
    rowMask[j] &= ~(1 << num);
    colMask[i] &= ~(1 << num);
    boxMask[Math.floor(i/3)*3 + Math.floor(j/3)] &= ~(1 << num);
}

function createMask()
{
    rowMask = new Array(9);
    colMask = new Array(9);
    boxMask = new Array(9);

    for(let i=0; i<9; i++)
    {
        for(let j=0; j<9; j++)
        {
            addToMask(i, j, board[i][j]);
        }
    }
}

function chkValid(i, j, num)
{
    if((rowMask[j] >> num & 1) || (colMask[i] >> num & 1) || (boxMask[Math.floor(i/3)*3 + Math.floor(j/3)] >> num & 1))
    {
        return false;
    }
    return true;
}

function backtrack(ind)
{
    if(ind === orderToFill.length)
    {
        return true;
    }
    console.log(ind);
    var i = Number(orderToFill[ind][0]);
    var j = Number(orderToFill[ind][1]);

    if(board[i][j])
    {
        return backtrack(ind+1);
    }
    
    for(let k=1; k<=9; k++)
    {
        if(chkValid(i, j, k))
        {
            board[i][j] = k;
            addToMask(i, j, k);

            if(backtrack(ind+1))
            {
                return true;
            }
            else
            {
                board[i][j]=0;
                removeFromMask(i, j, k);
            }
        }
    }

    return false;
}


function solve()
{
    createMask();
    createOrder();
    //console.log(orderToFill);
    backtrack(0);
}
