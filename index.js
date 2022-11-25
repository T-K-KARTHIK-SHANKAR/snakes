const gameScreen=document.getElementById('gamescreen');
const initialScreen=document.getElementById('initialScreen');
const newGameBtn=document.getElementById('newGameButton');
const joinGameBtn=document.getElementById('joinGameButton');
const gameCodeInput=document.getElementById('gameCodeInput');
const gameCodeDisplay=document.getElementById('gameCodeDisplay');
const sendbtn=document.getElementById('send');
const textarea=document.getElementById('ta');
newGameBtn.addEventListener('click',newGame);
joinGameBtn.addEventListener('click',joinGame);
function newGame()
{
socket.emit('newGame');
init();
}

function joinGame()
{
const code=gameCodeInput.value; 
socket.emit('joinGame',code);
init();
}
let canvas,ctx,playerNumber,gameActive=false;
import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket=io("https://multiplayersnakegamek.herokuapp.com/");
socket.on('init',handleInit);
socket.on('gameState',handleGameSate);
socket.on('gameOver',handleGameOver);
socket.on('gameCode',handleGameCode);
socket.on('unknownGame',handleUnknownGame);
socket.on('tooManyPlayers',handleTooManyPlayers);
socket.on('broadcast',broadcastmsg);
/* const gameState={
player:{
    pos:{
        x:3,
        y:10,
    },
    vel:{
    x:1,
    y:0,
    },
    snake:[
    {x:1,y:10},
    {x:2,y:10},
    {x:3,y:10}
    ],
},
food:{
x:7,
y:7,
},
gridsize:20,
}; */
const BG_COLOR='black';
const SNAKE_COLOR='yellow';
const FOOD_COLOR='orange';
function init()
{
initialScreen.style.display="none";
gameScreen.style.display="block";
textarea.style.display="block";
sendbtn.style.display="block";
canvas=document.getElementById('canvas');
ctx=canvas.getContext('2d');
canvas.width=canvas.height=600;
ctx.fillStyle=BG_COLOR;
ctx.fillRect(0,0,canvas.width,canvas.height);
document.addEventListener('keydown',keydown);
gameActive=true;
}
document.getElementById("send").addEventListener("click",chat);
function chat()
{
var msg=document.getElementById("ta").value;
socket.emit('chat',msg);
}
function keydown(e)
{
socket.emit('keydown',e.keyCode);
}


function paintGame(state)
{
ctx.fillStyle=BG_COLOR;
ctx.fillRect(0,0,canvas.width,canvas.height);
const food=state.food;
const gridsize=state.gridsize;
const size=canvas.width/gridsize;
ctx.fillStyle=FOOD_COLOR;
ctx.fillRect(food.x*size,food.y*size,size,size);
paintPlayer(state.players[0],size,SNAKE_COLOR);
paintPlayer(state.players[1],size,'red');
}

function paintPlayer(playerState,size,colour)
{
    const snake=playerState.snake;
    ctx.fillStyle=colour;
    for(let cell of snake)
    {
    ctx.fillRect(cell.x*size,cell.y*size,size,size);
    }
}

function handleInit(number)
{
playerNumber=number;
}

function handleGameSate(gameState)
{
if(!gameActive)
{
return;
}
gameState=JSON.parse(gameState);
requestAnimationFrame(()=>paintGame(gameState));
}

function handleGameOver(data)
{
if(!gameActive)
{
return;
}
data=JSON.parse(data);
if(data.winner===playerNumber)
{   
    ctx.fillStyle='green';
    ctx.font = "20px Georgia";
    ctx.fillText("you won!", 10, 50);
   /* const chatbox=document.createElement('textarea');
chatbox.innerHTML='enter your comments....';
chatbox.setAttribute("rows",4);
chatbox.setAttribute("cols",40);
canvas.parentNode.replaceChild(chatbox,canvas); */
}
else
{
    ctx.fillStyle='red';
    ctx.font = "20px Georgia";
    ctx.fillText("you lost!", 10, 50);
  /*  const chatbox=document.createElement('textarea');
chatbox.innerHTML='enter your comments....';
chatbox.setAttribute("rows",4);
chatbox.setAttribute("cols",40);
canvas.parentNode.replaceChild(chatbox,canvas); */
}

gameActive=false;
document.removeEventListener('keydown',keydown);

}

function handleGameCode(gameCode)
{
gameCodeDisplay.innerText=gameCode;
}

function handleUnknownGame()
{
reset(); 
alert('Unknown game code');
}

function handleTooManyPlayers()
{
reset(); 
alert('already game booked by 2 players');
}

function reset() 
{
playerNumber=null;
gameCodeInput.value="";
gameCodeDisplay.innerText="";
initialScreen.style.display="block";
gameScreen.style.display="none";
textarea.style.display="none";
}

function broadcastmsg(msg)
{
console.log(msg);
}

