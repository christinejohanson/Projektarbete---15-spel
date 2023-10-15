(function () {
    //globally variabels
    var overlay, sizeInput; 

    //function init
    function init() {
        //config user interference
        setupModal();
        setupControls();
        setupBoard();
        startNewGame();
    }

    //function to start new game
    function startNewGame() {
        var movesText = document.getElementById("moves");
        //set count to 0
        movesText.textContent = 0;
        //empty board
        emptyBoard();
        //take the input size
        var size = sizeInputEl.value;
        //generate board
        generateBoard(size);
        //update headline w correct size
        document.getElementById("titleNumber").innerText = (size * size) - 1;
    }

    function emptyBoard() {
        var board = document.getElementById("board");
        //if there is child elements
        while (board.firstChild) {
            board.firstChild.remove();
        }
    }

    //function to generate board with parameter size
    function generateBoard(size) {
        var board = document.getElementById("board");
        //create variable for the tiles
        var tiles;
        //loop to see if it is solvable
        do {
            tiles = generateTiles(size);
        } while (!isSolvable(tiles) || isSolved(tiles));
        // var tiles = generateTiles(size);
        //for loop to create tr and td
        for (var i = 0; i < size; i++) {
            //tr
            var outputRow = document.createElement("tr");
            for (var j = 0; j < size; j++) {
                var outputTile = document.createElement("td");
                if (tiles[i][j] === 0) {
                    //give it class blank
                    outputTile.className = "blank";
                }
                else {
                    outputTile.className = "tile";
                    //add number on the tile
                    outputTile.innerText = tiles[i][j];
                    //add eventlistner on tile
                    outputTile.addEventListener("click", moveThisTile, false);
                }

                //append tile to row
                outputRow.appendChild(outputTile);
            }
            //append row to board
            board.appendChild(outputRow);
        }
        console.log(tiles + "tiles");
    }

    //function for random number on the tiles
    function generateTiles(size) {
        //empty array
        var randomArray = [];
        //fill the array with right amount of numbers
        var max = size * size;
        //while loop that runs when less than max
        while (randomArray.length < max) {
            var randomNumber = Math.floor(Math.random() * max);
            //if to see if number is already in array
            if (randomArray.indexOf(randomNumber) === -1) {
                //add to array
                randomArray.push(randomNumber);
            }
        }
        //create a twodimensional array
        var tileArray = new Array(size);
        for (var i = 0; i < size; i++) {
            tileArray[i] = new Array(size);
        }

        //add random numbers in the 2d array
        var tileCount = 0;
        for (i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                tileArray[i][j] = randomArray[tileCount];
                tileCount++;
            }
        }
        return tileArray;
    }

    //function for game size and new game
    function setupControls() {
        var startButton = document.getElementById("startGame");
        startButton.addEventListener("click", startNewGame);
        //size of the board
        sizeInputEl = document.getElementById("boardSize");
        //create eventlistener to look for input
        sizeInputEl.addEventListener("input", function () {
            //get the span element
            var sizeDisplay = document.getElementById("currentSize");
            sizeDisplay.innerHTML = this.value + " &times " + this.value;
        });
    }

    //modal functions
    function setupModal() {
        //new div that is the background
        overlay = document.createElement("div");
        overlay.className = "overlay";
        var restartButton = document.getElementById("restartGame");
        //event listener on button
        restartButton.addEventListener("click", function () {
            closeModal();
            startNewGame();
        });
    }

    //change board with move error
    function setupBoard() {
        //variable for table board
        var board = document.getElementById("board");
        //eventlistener that listens to moveerror
        board.addEventListener("moveError", function () {
            //create element variable instead of only this
            var el = this;
            //add class
            el.className = "wrong-move";
            //remove classname after 200 millisec
            setTimeout(function () {
                el.className = "";
            }, 200);
        });
    }

    function openModal() {
        var winModal = document.getElementById("winModal");
        //remove class offscreen
        winModal.classList.remove("off-screen");
        //element that covers everything behind modal window
        document.body.appendChild(overlay);
    }

    function closeModal() {
        var winModal = document.getElementById("winModal");
        //add class offscreen
        winModal.classList.add("off-screen");
        //remove background
        document.body.removeChild(overlay);
    }
     
    //function for move the tiles
    function moveThisTile() {
        //find the cell position
        var column = this.cellIndex;
        var row = this.parentNode.rowIndex;
        //find the hole position
        var hole = document.querySelector(".blank");
        var holeColumn = hole.cellIndex;
        var holeRow = hole.parentNode.rowIndex;
        //compare the two values from row and column
        var diffCols = holeColumn - column;
        var diffRows = holeRow - row; 
        //check if the difference is 1
        if ((Math.abs(diffRows) === 1 && diffCols === 0) || (Math.abs(diffCols) === 1 && diffRows === 0)) {
            //calling function
            swapElements(this, hole);
            incrementMoves();
        }
        else {
            //create error event
            var errorEvent = new Event("moveError", { "bubbles": true });
            //to fire the event
            this.dispatchEvent(errorEvent);
            // alert("Den här brickan går ej att flytta!");
        }
    }

    // Hjälpfunktion för att byta plats på två DOM-element
    function swapElements(el1, el2) {
        // Spara positionen för el2
        var parent2 = el2.parentNode;
        var next2 = el2.nextSibling;
        // Specialfall där el1 är nästa syskon till el2
        if (next2 === el1) {
            // Placera el1 före el2
            parent2.insertBefore(el1, el2);
        } else {
            // Placera el2 före el1
            el1.parentNode.insertBefore(el2, el1);

            // Placera el1 där el2 tidigare var
            if (next2) {
                // Om det fanns ett element efter el2, placera el1 före detta element
                parent2.insertBefore(el1, next2);
            } else {
                // I annat fall, lägg till el1 som barn till el2:s tidigare förälder
                parent2.appendChild(el1);
            }
        }
    }

    //to count the moves
    function incrementMoves() {
        var movesText = document.getElementById("moves");
        var moves = parseInt(movesText.textContent);
        moves++;
        movesText.textContent = moves;

        //check if all bricks are right
        if (checkIfWinner()) {
            //add moves to the winmoves
            document.getElementById("winMoves").textContent = moves;
            //call the function
            openModal();
        }
    }

    //check the bricks in right position
    function checkIfWinner() {
        //get the dom element
        var board = document.getElementById("board");
        var size = board.rows.length;
        //create loop to check the numbers one by one
        var count = 1;
        //get all the tiles
        var tiles = board.getElementsByTagName("td");
        //while loop
        while (count < tiles.length){
            if(tiles[count - 1].textContent != count){
                return false;
            }
            count++;
        }
        // Om vi har tagit oss hela vägen genom brädet utan fel har spelaren vunnit
        return true;

    }

    //test för olika random siffror med avrundning uppåt o neråt
    // var randNum = Math.random(); 
    // console.log(randNum); 
    // var max = 16;
    // var randIntFloor = Math.floor(randNum * max);
    // console.log(randIntFloor);
    // var randIntCeil = Math.ceil(randNum * max);
    // console.log(randIntCeil);
    //run init when window is loaded
    window.addEventListener("load", init);


})();