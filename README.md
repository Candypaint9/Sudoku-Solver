# Sudoku Solver
 A sudoku solver made using p5.js


Uses backtracking to find the correct solution with optimizations such as:
-> creating bitmasks for rows, columns and boxes(3x3) the numbers present on the board to enable O(1) checks to see if a number can be place in a particular box or not
-> backtracking in a sorted order of spaces according to the least amount of number that can be placed in that space