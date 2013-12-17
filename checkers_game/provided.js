$('document').ready(function() {


    //calls YOUR CODE
    //add the squares to the board
    buildBoard();
    
    //calls YOUR CODE LAST WEEK
    //set up the board with the correct classes
    //for the light and dark squares
    setUpBoard();    
    
    
    //calls YOUR CODE
    //add the pieces to the board
    addPieces();
    
    //calls YOUR CODE LAST WEEK
    //sets up the classes for the different types of piece
    setUpPieces();
    
    //this loop moves all the light pieces to their initial positions
    $('div.piece.light').each(function(index,piece) {
        
        //turning the index (from 0 - 11)
        //into a x,y square coordinate using math
        var y = Math.floor(index / 4);
        var x = (index % 4) * 2 + (1 - y%2);
        
        //turning the x,y coordingate into a pixel position
        var pixelPosition = getPixels(x,y);
        
        //YOUR CODE LAST WEEK
        //actually moving the piece to its initial position
        movePieceTo($(piece),pixelPosition.top,pixelPosition.left);
    });
    
    //this loop moves all the dark pieces to their initial positions
    $('div.piece.dark').each(function(index,piece) {
        
        //turning the index (from 0 - 11)
        //into a x,y square coordinate using math
        var y = Math.floor(index/4) + 5;
        var x = (index % 4) * 2 + (1-y%2);
        
        //turning the x,y coordinate into a pixel position
        var pixelPosition = getPixels(x,y);
        
        //YOUR CODE LAST WEEK
        //moving the piece to its initial position
        movePieceTo($(piece),pixelPosition.top,pixelPosition.left);
    });
    
    
    //and now the events
    $('div.piece').click(function() {
        
        //turn `this` into a jQuery object
        var $this = $(this);
        
        //YOUR CODE LAST WEEK
        //toggleing the 'selected' class of this piece
        //and possible deselecting other pieces
        toggleSelect($this);
        
        //YOUR CODE
        resetMovables();
        
        //get the legal moves for this
        if ($this.hasClass('selected')) {
            getMovableSquares($this).addClass('movable');
        }
        
    });
    
    $('div.square').click(function() {
        
        //turn `this` into a jQuery object
        var $this = $(this);
        
        //if $this is a legal square to move to...
        if ($this.hasClass('movable')) {
            
            //get the piece with the class 'selected'
            var $selectedPiece = $('div.piece.selected');
            
            //we only move if there is exactly one selected piece
            if ($selectedPiece.length == 1) {
                //get the index of the square
                //and translate it to pixel position
                var index = $this.prevAll().length;
                var x = index % 8;
                var y = Math.floor(index / 8);
                var pixels = getPixels(x,y);
                
                //YOUR CODE
                //actually do the moving
                movePieceTo($selectedPiece,pixels.top,pixels.left);
                
                //YOUR CODE
                //.prevAll().length is a trick to get the index
                //of the selected piece
                checkKing($selectedPiece,$this.prevAll().length);
                
                //YOUR CODE
                handleCapturedPieces($this);
                
                //YOUR CODE LAST WEEK
                //increment the move counter
                incrementMoveCount();
                
                //un-select the piece
                $selectedPiece.removeClass('selected');
                
                //YOUR CODE
                //reset the new legal moves
                resetMovables();
            }
            
        }
    });

});







function setUpPieces() {
    //select all the divs with class 'piece'
    //add the 'light' class to half of them
    //add the 'dark' to the other half
    $('div.piece:even').addClass('light');
    $('div.piece:odd').addClass('dark');
    
}

function movePieceTo($piece,newTop,newLeft) {
    //set the css 'top' and 'left'
    //attributes of the passed piece
    //to the arguments newTop and newLeft
    $piece.css('top',newTop);
    $piece.css('left',newLeft);
    
}

function setUpBoard() {
    //iterate through all of the divs 
    //with class `square`
    //figure out whether each one should be
    //light or dark, and assign the proper class
    
    //heres a helper function that takes a number between
    //0 and 63 (inclusive) and returns 1 if the square should be
    //dark, and 0 if the square should be light
    function lightOrDark(index) {
        var x = index % 8;
        var y = Math.floor(index / 8);
        var oddX = x % 2;
        var oddY = y % 2;
        return (oddX ^ oddY);
    }
    
    $('div.square').each(function(index,square) {
        if (lightOrDark(index)) {
            $(square).addClass('dark');
        } else {
            $(square).addClass('light');
        }
    });
    
}

function toggleSelect($piece) {
    //if $piece has the class 'selected',
    //remove it
    
    //if $piece does not have the class 'selected'
    //make sure no other divs with the class 'piece'
    //have that class, then set $piece to have the class
    
    if ($piece.hasClass('selected')) {
        $piece.removeClass('selected');
    } else {
        $('div.piece').removeClass('selected');
        $piece.addClass('selected');
    }
    
    
}

function incrementMoveCount() {
    //gets the html of the span with id
    //moveCount
    //turns it into a number
    //increments it by one
    //sets the html of the span with id moveCount
    //to the new move count
    
    var curMoveCount = parseInt($('#moveCount').html(),10);
    curMoveCount++;
    $('#spanMoveCount').html(curMoveCount);
}


//global variables for one square
var width = 46;
var border = 2;

//utility function for translating an x,y coordinate
//to a pixel position
//the convention is that the square in the upper left
//corner is at position 0,0
//the square in the upper right, at 7,0 and the lower
//right at 7,7f
function getPixels(x,y) {
    //ok... so takes an x,y position, returns
    //pixels from the left, right
    
    return {
        'top':  (y * (width+border))+'px',
        'left': (x * (width+border))+'px'
    };    
}

//utility function for turning a pixel position
//into the x,y coordinate of a square on the board
//it follows the same coordinate convention as getPixels
function getCoords(top,left) {
    //returns an x and a y
    //given a top and left pixels
    return {
        'x': left / (width + border),
        'y': top / (width + border)
    };
}

//utility function for returning
//the set of legal moves given a piece
// SIDE EFFECT: stores jumped pieces in a data element
// of each square that can be moved to
function getMovableSquares($piece) {
    
    //select all of the squares
    var $squares = $('div.square');
    
    //select the occupied ones using the jQuery map() method
    //map creates a new object from an existing one
    //using a translation function
    var takenSquares = {};
    $('div.piece').each(function(index,piece) {
            
            //this function translates a piece
            var position = $(piece).position();
            var coords = getCoords(position.top,position.left);
            var squareIndex = coords.y * 8 + coords.x;
            takenSquares[squareIndex] = $(piece);
    });
    
    var coords = getCoords($piece.position().top,$piece.position().left);
    
    //lights move down
    var lightVectors = [
        {x:1,y:1},
        {x:-1,y:1}
    ];
    //darks move up
    var darkVectors = [
        {x:1,y:-1},
        {x:-1,y:-1}
    ];
    //kings move any which way
    var kingVectors = lightVectors.concat(darkVectors);
    
    
    var vectors;
    if ($piece.hasClass('king')) {
        vectors = kingVectors;
    } else if ($piece.hasClass('light')) {
        vectors = lightVectors;
    } else {
        vectors = darkVectors;
    }
    
    var outOfBounds = function(coords) {
        return !(coords.x >= 0 && coords.x < 8 && coords.y >= 0 && coords.y < 8);
    };
    
    var $legalSquares = $();
    var buildMoves = function(coords,vectors,jumpsOnly) {
        

        if (outOfBounds(coords)) return;
        
        //our current square is at coords
        var $currentSquare = $squares.eq(coords.y*8 + coords.x);
        
        $.each(vectors,function(index,vector) {
            

            var newCoords = {
                x:vector.x + coords.x,
                y:vector.y + coords.y
            };

            
            if (outOfBounds(newCoords)) return;

            
            var newSquareIndex = 8*newCoords.y + newCoords.x;
            //if the square is taken,
            if (takenSquares[newSquareIndex]) {
                //it gets interesting
                //ok - so we can only jump if their
                //piece is different from ours
                if ($piece.hasClass('dark')) {
                    if (takenSquares[newSquareIndex].hasClass('dark')) return;
                } else {
                    if (takenSquares[newSquareIndex].hasClass('light')) return;
                }
                
                
                var jumpCoords = {
                    x: vector.x*2 + coords.x,
                    y: vector.y*2 + coords.y
                };
                if (outOfBounds(jumpCoords)) return;
                
                var jumpSquareIndex = jumpCoords.y*8 + jumpCoords.x;
                //if the jump square is free...
                //add it and the data-jumped-pieces
                if (!takenSquares[jumpSquareIndex]) {
                    var $newSquare = $squares.eq(jumpSquareIndex);
                    //if we haven't already seen it
                    if (!$newSquare.is($legalSquares)) {
                        
                        //add the passed over square to it
                        $legalSquares = $legalSquares.add($newSquare);
                        
                        //and the jumped squares from how we got here
                        var $jumpedPieces = takenSquares[newSquareIndex];
                        if ($currentSquare.data('jumpedPieces')) {
                            $jumpedPieces = $jumpedPieces.add($currentSquare.data('jumpedPieces'));
                        }
                        $newSquare.data('jumpedPieces',$jumpedPieces);
                        
                        //and recurse, with jumpsOnly set to true
                        buildMoves(jumpCoords,vectors,true);                        
                    }
                }
            } else if (!jumpsOnly) {
                var $newSquare = $squares.eq(newSquareIndex);
                $newSquare.data('jumpedPieces',$());
                $legalSquares = $legalSquares.add($newSquare);
            }
            
        }); 
    };
    buildMoves(coords,vectors,false);
    return $legalSquares;
    
}

