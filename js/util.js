// Original code: https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
// 
// A utility function to count inversions in given 
// array 'arr[]'. Note that this function can be 
// optimized to work in O(n Log n) time. The idea 
// here is to keep code small and simple. 

function getInvCount(puzzle, n) {
    var arr = [].concat.apply([], puzzle);
    var inv_count = 0;
    for (var i = 0; i < n * n - 1; i++) {
        for (var j = i + 1; j < n * n; j++) {
            // count pairs(i, j) such that i appears 
            // before j, but i > j. 
            if (arr[j] && arr[i] && arr[i] > arr[j]){
                inv_count++;
            }
        }
    }
    return inv_count;
}

// find Position of blank from bottom 
function findXPosition(puzzle, n) {
    // start from bottom-right corner of matrix 
    for (var i = n - 1; i >= 0; i--) {
        for (var j = n - 1; j >= 0; j--) {
            if (puzzle[i][j] === 0) {
                return n - i;
            }
        }
    }
}

// This function returns true if given 
// instance of n*n - 1 puzzle is solvable 
function isSolvable(puzzle) {
    var n = puzzle.length;
    // Count inversions in given puzzle 
    var invCount = getInvCount(puzzle, n);

    // If grid is odd, return true if inversion 
    // count is even. 
    if (n & 1) {
        return !(invCount & 1);
    } else {
        // grid is even 
        pos = findXPosition(puzzle, n);
        if (pos & 1) {
            return !(invCount & 1);
        } else {
            return invCount & 1;
        }
    }
}

// This function returns true if given 
// puzzle is already solved
function isSolved(puzzle) {
    // Start counter on 1
    var count = 1;

    // Flatten array (not supported in IE)
    var tiles = puzzle.flat();

    while (count < tiles.length){
        if(tiles[count - 1] != count){
            return false;
        }
        count++;
    }
    return true;
}