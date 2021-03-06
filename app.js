// get the canvas tag by id
var canvas = document.getElementById("myCanvas");
// use the gotten id to access the canvas drawing tool(getContext)
var ctx = canvas.getContext("2d");
// The x and y variable is used to initialize the starting points of the arc drawn
var x = canvas.width/2;
var y = canvas.height-30;
// the dx and dy variables are used to actually make the ball or arc moves from its position
var dx = 2;
var dy = -2;
// define the ball radius
var ballRadius = 10;
// So, we need a paddle to hit the ball — let's define a few variables for that.
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// Pressed buttons can be defined and initialized with boolean variables, like so
var rightPressed = false;
var leftPressed = false;
// declaring variable for bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// declare score
var score = 0;

// lives
var lives = 5;

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
	bricks[c] = [];
	for(r=0; r<brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}



// the function draws an arc with a defined x,y and ball radius
function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y,ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

// function to draw paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

// loop through bricks and draw them
function drawBricks() {
	for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status == 1) {
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}


// the draw function is called every 10 milliseconds which first clears the canvas before drawing on it
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
 // instead of calculating the collision point of the wall and the center of the ball,we should be doing it for its circumference.
 if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
 	dx = -dx;
 }
 if(y + dy < ballRadius) {
 	dy = -dy;
 } else if(y + dy > canvas.height-ballRadius) {
 	if(x > paddleX && x < paddleX + paddleWidth) {
 		dy = -dy;
 	}
 	else {
 		lives--;
 		if(!lives) {
 			alert("GAME OVER");
 			document.location.reload();
 		}
 		else {
 			x = canvas.width/2;
 			y = canvas.height-30;
 			dx = 2;
 			dy = -2;
 			paddleX = (canvas.width-paddleWidth)/2;
 		}
 	}
 }

    // check the key presssed and move paddle in that direction
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
    	paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
    	paddleX -= 7;
    }

    x += dx;
    y += dy;


    requestAnimationFrame(draw);
}

// listen for key-up and key-down events on the keyboard
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// listen for mousemove event
document.addEventListener("mousemove", mouseMoveHandler, false);

// mouseMoveHandler function
function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth/2;
	}
}

/******

	  ASCII CODES for
	  left arrow -> 37
	  up arrow -> 38
	  right arrow -> 39
	  down arrow -> 40

	  *******/

// key down function
function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
}

// key up function
function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
	}
}

// function for collision detection
function collisionDetection() {
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if(b.status == 1) {
				if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
					dy = -dy;
					b.status = 0;
					score+=2;
					if(score == brickRowCount*brickColumnCount) {
						alert("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
					}
				}
			}
		}
	}
}

// draw score function
function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Score: "+score, 8, 20);
}

// function to draw live counter
function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

draw();
