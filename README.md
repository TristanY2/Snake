Classic Snake game in vanilla JS and HTML5 from scratch.

first project built to explore game loop logic and DOM manipulation.

Code snippet (movement logic)

//Moving the snake manipulating the array
function moverSerpiente() {
	let newHead = {
		x:snake[0] + direction.x*size,
		y:snake[0] + direction.y*size
	}

	snake.unshift(newHead); // Add new head at the begin of the array
	snake.pop(); // Delete last part to maintain array lenght
}
