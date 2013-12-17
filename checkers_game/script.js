//Exercise 2
//This function should create 64 divs with the class 'square'
//and insert them into the div with id 'board'
function buildBoard() {
   
   for (var i=0;i<64;i++){
       $('div #board').append($('<div class="square"><div>'));
   }
}


//Exercise 3
//this function shoudl create 24 divs with the class piece and
//insert them into the div with id 'pieces'
function addPieces() {
    for (var i=0;i<24;i++){
       $('div #pieces').append($('<div class="piece"><div>'));
   }
}

//Exercise 4
//this function should do two things
// 1. remove the data item with key 'jumpedPieces' from every div.square
// 2. remove the class 'movable' from every square
function resetMovables() {
    $('div.square').removeData('jumpedPieces');
    $('div.square').removeClass('movable');
}

//Exercise 5
// this function should get the jQuery object stored in
// the data object of $square under the key 'jumpedPieces'
// it should remove every element in that jQuery selection
function handleCapturedPieces($square) {

    $jumped = $square.data('jumpedPieces');
    $jumped.remove();
}



//Exercise 6
// This function takes a $piece and the index of a square
// squareIndex will be between 0 - 63 (inclusive).
// if the index refers to an element in the first row or last row,
// the class 'king' should be added to the $piece
function checkKing($piece,squareIndex) {
    if (squareIndex<8 || squareIndex>55){
        $piece.addClass('king');
    }
}
