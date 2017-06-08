//document.getElementById("MyEdit").innerHTML = "12";
var words = ['actor', 'danger', 'lungs', 'memory', 'skeleton'];
var charW, lives, ch;
var a_canvas = document.getElementById("hangman");
var context = a_canvas.getContext("2d");
var endGame = false;
var usedChars;
var allText = "";
var guessWord, guessArray;
var lastIndex = 0;


//Get contents from a text file
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                return;
            }
        }
    }
    rawFile.send(null);
}

//Add words (from text file) to the words array
var addFromFile = function(){
    readTextFile('input.txt');
    var arrAddWords = allText.split(" ");
    for(var i = 0; i < arrAddWords.length; i++){
        if(arrAddWords[i].length > 2)
            words.push(arrAddWords[i]);
    }
}

//Start a new game (Resets all varaibles)
var resetGame = function(){
    document.getElementById("game_over").innerHTML = "";
    endGame = false;
    lives = 5;
    guessArray = [];
    usedChars = [];
    guessWord = getWord(words.length);
    console.log(guessWord);
    charW = wordToArr(guessWord);
    //Creates a blank word for the length of the word to be guessed
    for(var i = 0; i < charW.length; i++){
        guessArray[i] = "_";
    }
}

//generates a random word from an array of words
var getWord = function (max) {
    var randWord = 0;
    do{
      randWord =  Math.floor((Math.random() * max)); 
    }while(randWord === lastIndex);//Ensures that the same word is not picked twice in a row
    lastIndex = randWord;
    return words[randWord];
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
addFromFile();
resetGame();

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
    if(gameWon(charW))
        document.getElementById("game_over").innerHTML = "YOU WON!";
    //Game Over Message
    if(lives > 0){
        mainDraw(lives);
    }else{
        //wait 1 sec then refresh the page (i.e new game)
        document.getElementById("game_over").innerHTML = "GAME OVER!";
        lives = 0;
        endGame = true;
        //reload();
    }
    charW = charArr;
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

var wordExists = function(word){
    for(var i = 0; i < words.length; i++){
        if(words[i].toLowerCase === word)
            return true;
    }
    return false;
}

//Draw the hangman face according to the lives the user has left
var mainDraw = function(lives){
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
    if(c == "Add Word"){
        var word = prompt("What word would you like to add? (Note: It Will Not Accept Spaces)");
        word = word.replace(/\s/g,'');
        if(!wordExists()){
            words.push(word);
        }
    }else if(c == "New Game"){
        context.clearRect(0, 0, a_canvas.width, a_canvas.height);
        resetGame();
    }
    else if(!endGame)
        inWord(charW, c);
    document.getElementById("update").innerHTML = arrtoStr(guessArray);
})


