//document.getElementById("MyEdit").innerHTML = "12";
var words = ['actor', 'danger', 'lungs', 'memory', 'skeleton', 'thumb', 'blizzard', 'galvanize', 'hangman', 'transcript'];
var charW = [];
var lives = 5;
var ch;
var a_canvas = document.getElementById("hangman");
var context = a_canvas.getContext("2d");
var terminateTime = 500;//milliseconds
var endGame = false;
var usedChars = [];

//generates a random word from an array of words
var getWord = function (max) {
    return words[Math.floor((Math.random() * max))];
}

//converts a character array to a string array
var arrtoStr = function(array){
    var str = "";
    for(var i = 0; i < array.length; i++){
        str += array[i] + " ";
    }
    return str;
}

//gets the word to be guessed and converts it to an array
var wordToArr = function(word){
    var tmpChr = [];
    for(var i = 0; i < word.length; i++){
        tmpChr[i] = word.charAt(i);
    }
    return tmpChr;
}

//Get the word the user has to guess and make it into a character array
var guessWord = getWord(words.length);
var guessArray = [];
charW = wordToArr(guessWord);

//Creates a blank word for the length of the word to be guessed
for(var i = 0; i < charW.length; i++){
    guessArray[i] = "_";
}

//Identify which letters have been guessed so far
var addUsedChars = function(char){
    for(var i = 0; i < usedChars.length; i++){
        if(usedChars[i] === char)
            return;
    }
    usedChars.push(char);
    usedChars.sort();
}

//See if the letter pressed has already been used
var deductPoints = function(charsGuessed, char){
    for(var i = 0; i < charsGuessed.length; i++){
        if(charsGuessed[i] === char)
            return false;
    }
    return true;
}

//checks to see if the guessed character is in the word
var inWord = function(array, char){
    var charArr = array;
    var checked = false;
    for(var i = 0; i < charArr.length; i++){
        if(array[i] === char){
            guessArray[i] = charArr[i];
            charArr[i] = '-';
            checked = true;
        }
    }
    
    //Only deduct a life if the letter has not already been guessed
    if(!checked && deductPoints(usedChars, char)){
        lives -= 1;
    }
    
    addUsedChars(char);
    document.getElementById("used_words").innerHTML = arrtoStr(usedChars);
    if(gameWon(charW)){
        document.getElementById("game_over").innerHTML = "YOU WON!";
        reload();
    }
    //Game Over Message
    if(lives > 0){
        mainDraw(lives);
    }else{
        //wait 1 sec then refresh the page (i.e new game)
        document.getElementById("game_over").innerHTML = "GAME OVER!";
        lives = 0;
        endGame = true;
        reload();
    }
    charW = charArr;
}

//Reload-Refresh the Page
var reload = function(){
     setTimeout(function() {
            location.reload();
        },terminateTime);
}


//Check to see if the word has been guessed
var gameWon = function(arr){
    for(var i = 0; i < arr.length; i++){
        if(arr[i] != '-'){
            return false;
        }
    }
    endGame = true;
    return true;
}

//Draw the hangman face according to the lives the user has left
var mainDraw = function(lives){
   console.log("Here");
    switch(lives){
        case 4://draw face
            drawFace();
            return;
        case 3://draw Left Eye
            drawFace();
            drawEye(75, 75, 5, 0);
            return;
        case 2://draw Right Eye
            drawFace();
            drawEye(75, 75, 5, 0);
            drawEye(114, 75, 5, 0);
            return;
        case 1://draw Mouth
            drawFace();
            drawEye(75, 75, 5, 0);
            drawEye(114, 75, 5, 0);
            drawMouth();
            return;
    }
    context.fillStyle = "black";
}

//draw the face in yellow
var drawFace = function(){
    context.fillStyle = "yellow";
    context.beginPath();
    context.arc(95, 85, 40, 0, 2*Math.PI);
    context.closePath();
    context.fill();
    context.lineWidth = 2;
    context.stroke();
}

//draw both eyes (specfiy parameters for each eye) in black
var drawEye = function(x,y,w,h){
    context.fillStyle = "black";
    context.beginPath();
    context.arc(x, y, w, h, 2*Math.PI);
    context.closePath;
    context.fill();
}

//draw the mouth in black
var drawMouth = function(){
    context.fillStyle = "black";
    context.beginPath();
    context.arc(95, 90, 26, Math.PI, 2*Math.PI, true);
    context.closePath();
    context.fill();
}

var drawBody = function(){
    console.log("Here");
    context.moveTo(0 ,0);
    context.lineTo(100,100);
}

//JQuery code to detect button presses
$('input:button').click(function() {
    var c = $(this).val();//get the value of the button clicked
    if(!endGame && c != "Add Word")
        inWord(charW, c);
    else if(c === "Add Word"){
        var wordAdd = prompt("Which Word Would You Like to Add?")
    }
    document.getElementById("update").innerHTML = arrtoStr(guessArray);
})


