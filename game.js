// ======================================
// INFINITY BRICK BREAKER - GAME.JS
// PART 1
// ======================================


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


// GAME DATA

let score = 0;

let highScore =
localStorage.getItem("highScore") || 0;

let level = 1;

let lives = 3;

let running = false;


let paddle;

let balls = [];

let bricks = [];

let keys = {};



let ballColor =
localStorage.getItem("ballColor") || "yellow";


let paddleColor =
localStorage.getItem("paddleColor") || "cyan";


let unlockedLevel =
Number(localStorage.getItem("unlockedLevel")) || 1;





// SOUNDS

let hitSound =
new Audio(
"https://actions.google.com/sounds/v1/cartoon/pop.ogg"
);


let backgroundMusic =
new Audio(
"https://cdn.pixabay.com/audio/2022/03/15/audio_c8b2f8d7c6.mp3"
);


backgroundMusic.loop = true;





// START GAME


function showGame(){

document.getElementById("mainMenu").style.display="none";

canvas.style.display="block";

startGame();

}




function startGame(){


score = 0;

lives = 3;

running = true;



paddle = {

x:340,

y:460,

width:120,

height:15,

speed:8

};





balls=[{

x:400,

y:300,

dx:3,

dy:-3,

size:10

}];



createLevel();



document.getElementById("gameOver").style.display="none";



playMusic();


}





// CREATE LEVELS


function createLevel(){


bricks=[];


let rows =
Math.min(10,4+Math.floor(level/10));



for(let r=0;r<rows;r++){


for(let c=0;c<10;c++){



bricks.push({

x:50+c*70,

y:70+r*25,

w:60,

h:18,

alive:true,

color:
`hsl(${Math.random()*360},80%,50%)`

});


}


}


}






// DRAW PADDLE


function drawPaddle(){


ctx.fillStyle=paddleColor;


ctx.fillRect(

paddle.x,

paddle.y,

paddle.width,

paddle.height

);


}





// DRAW BALL


function drawBalls(){


balls.forEach(ball=>{


ctx.beginPath();


ctx.arc(

ball.x,

ball.y,

ball.size,

0,

Math.PI*2

);


ctx.fillStyle=ballColor;


ctx.fill();


});


}






// DRAW BRICKS


function drawBricks(){


bricks.forEach(brick=>{


if(brick.alive){


ctx.fillStyle=brick.color;


ctx.fillRect(

brick.x,

brick.y,

brick.w,

brick.h

);


}


});


}





// UPDATE GAME


function update(){


if(!running)
return;



if(keys["ArrowLeft"])

paddle.x-=paddle.speed;



if(keys["ArrowRight"])

paddle.x+=paddle.speed;





if(paddle.x<0)

paddle.x=0;



if(paddle.x+paddle.width>canvas.width)

paddle.x=canvas.width-paddle.width;





balls.forEach(ball=>{


ball.x+=ball.dx;

ball.y+=ball.dy;





if(ball.x<0 || ball.x>canvas.width)

ball.dx=-ball.dx;



if(ball.y<0)

ball.dy=-ball.dy;





// PADDLE HIT


if(

ball.y+ball.size>=paddle.y &&

ball.x>paddle.x &&

ball.x<paddle.x+paddle.width

){


ball.dy=-ball.dy;

playSound();


}





// BRICKS


bricks.forEach(brick=>{


if(

brick.alive &&

ball.x>brick.x &&

ball.x<brick.x+brick.w &&

ball.y>brick.y &&

ball.y<brick.y+brick.h

){


brick.alive=false;


score+=10;


ball.dy=-ball.dy;


playSound();


}


});


});




balls =
balls.filter(ball=>ball.y<520);




if(balls.length===0){


lives--;



if(lives<=0){


endGame();


}

else{


balls=[{

x:400,

y:300,

dx:3,

dy:-3,

size:10

}];


}


}




let left =
bricks.filter(b=>b.alive).length;



if(left===0){


nextLevel();


}



}  // ======================================
// INFINITY BRICK BREAKER - GAME.JS
// PART 2
// ======================================



// DRAW GAME INFORMATION


function drawInfo(){


document.getElementById("status").innerHTML=

"Score: "+score+
" | Level: "+level+
" | Lives: "+lives+
" | High Score: "+highScore;


}







// GAME LOOP


function gameLoop(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



if(running){


drawPaddle();

drawBalls();

drawBricks();

update();


}


drawInfo();



requestAnimationFrame(gameLoop);


}


gameLoop();








// LEVEL COMPLETE


function nextLevel(){



if(level>=unlockedLevel){


unlockedLevel=level+1;


localStorage.setItem(

"unlockedLevel",

unlockedLevel

);


}




if(level>=100){


alert(
"🏆 Congratulations!\nYou completed all 100 levels!"
);


backHome();


return;


}





running=false;



alert(

"You got it! 🎉\n\nLet's try next levels"

);



showLevels();


}









// GAME OVER


function endGame(){


running=false;



if(score>highScore){


highScore=score;


localStorage.setItem(

"highScore",

highScore

);


}





document.getElementById("gameOver").style.display="block";



document.getElementById("result").innerHTML=

"Score : "+score+
"<br>High Score : "+highScore;



}








// PLAY AGAIN


function restartGame(){


level=1;


startGame();


}








// LEVEL MAP


function showLevels(){


document.getElementById("mainMenu").style.display="none";


document.getElementById("settings").style.display="none";


document.getElementById("levelMap").style.display="block";



let box =
document.getElementById("levels");



box.innerHTML="";




for(let i=1;i<=100;i++){



let button =
document.createElement("button");



if(i<=unlockedLevel){



button.innerHTML =
"LEVEL "+i;



button.onclick=function(){



level=i;



document.getElementById("levelMap").style.display="none";


canvas.style.display="block";


startGame();



};



}

else{


button.innerHTML =
"🔒 LEVEL "+i;


button.disabled=true;


}





box.appendChild(button);



if(i%10===0){


box.appendChild(
document.createElement("br")
);


}



}


}









// SETTINGS


function showSettings(){



document.getElementById("mainMenu").style.display="none";


document.getElementById("settings").style.display="block";



document.getElementById("username").value=

localStorage.getItem("username") || "";



document.getElementById("ballColor").value=

ballColor;



document.getElementById("paddleColor").value=

paddleColor;



document.getElementById("music").checked=

localStorage.getItem("music")=="true";



document.getElementById("sounds").checked=

localStorage.getItem("sounds")=="true";



}








function saveSettings(){



localStorage.setItem(

"username",

document.getElementById("username").value

);



ballColor =
document.getElementById("ballColor").value;



paddleColor =
document.getElementById("paddleColor").value;





localStorage.setItem(

"ballColor",

ballColor

);



localStorage.setItem(

"paddleColor",

paddleColor

);





localStorage.setItem(

"music",

document.getElementById("music").checked

);



localStorage.setItem(

"sounds",

document.getElementById("sounds").checked

);




alert("Settings Saved");


}









// HOME BUTTON


function backHome(){


running=false;



document.getElementById("mainMenu").style.display="block";


document.getElementById("levelMap").style.display="none";


document.getElementById("settings").style.display="none";


canvas.style.display="none";


document.getElementById("status").innerHTML="";


}








// FULLSCREEN


function toggleFullscreen(){



if(!document.fullscreenElement){


document.documentElement.requestFullscreen();


}

else{


document.exitFullscreen();


}


}// ======================================
// INFINITY BRICK BREAKER - GAME.JS
// PART 3
// ======================================


// KEYBOARD CONTROLS


document.addEventListener(
"keydown",
function(e){


keys[e.key]=true;



// SPACEBAR RESTART


if(e.code==="Space"){


if(!running){


restartGame();


}


}



});





document.addEventListener(
"keyup",
function(e){


keys[e.key]=false;


});








// MOBILE CONTROLS


document.getElementById("left").ontouchstart=function(){


if(paddle){


paddle.x-=50;


playSound();


}


};





document.getElementById("right").ontouchstart=function(){


if(paddle){


paddle.x+=50;


playSound();


}


};





// ALSO SUPPORT MOUSE CLICK


document.getElementById("left").onclick=function(){


if(paddle){


paddle.x-=50;


playSound();


}


};





document.getElementById("right").onclick=function(){


if(paddle){


paddle.x+=50;


playSound();


}


};








// SOUND EFFECT


function playSound(){



let enabled =
document.getElementById("sounds");



if(enabled && enabled.checked){


hitSound.currentTime=0;


hitSound.play();


}


}








// MUSIC CONTROL


function playMusic(){


let enabled =
document.getElementById("music");



if(enabled && enabled.checked){


backgroundMusic.play().catch(()=>{});


}


}




function stopMusic(){


backgroundMusic.pause();


}









// AUTO SAVE HIGH SCORE


setInterval(function(){



if(score>highScore){


highScore=score;



localStorage.setItem(

"highScore",

highScore

);


}



},1000);








// LOAD SAVED SETTINGS


window.addEventListener(
"load",
function(){



ballColor =

localStorage.getItem("ballColor")
||
"yellow";



paddleColor =

localStorage.getItem("paddleColor")
||
"cyan";



unlockedLevel =

Number(
localStorage.getItem("unlockedLevel")
)
||
1;



});






// PREVENT RIGHT CLICK MENU


document.addEventListener(
"contextmenu",
function(e){

e.preventDefault();

});





// END OF GAME.JS
