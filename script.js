// obtener el canvas y el contexto
const btIniciar = document.getElementById("botonIniciar");
const btReiniciar = document.getElementById("botonReiniciar")
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // sin el getContext solo queda un cuadro en blanco
// esta parte le dice al navegador que vamos a dibujar graficos en 2D
// ctx se usa para dibujar figuras en el canvas, como un lapiz para usar.

// tamaño de la cuadricula
const tamano = 40;

let puntaje = 0;
let serpiente = [{x:200, y:200}, {x:180, y: 200}]
let comPos, direccion, cambioDireccion, gameLoop, comidaEspecial;

function IniciarJuego(){
// posición inicial de la serpiente
  puntaje = 0
  serpiente = [{x:200, y:200}, {x:180, y: 200}];

// dirección inicial
  direccion = {x:1, y:0};

  cambioDireccion = true

  btIniciar.style.display = "none";
  btReiniciar.style.display = "none";

  if (gameLoop) clearInterval(gameLoop);
  // iniciar el juego con intervalos de tiempo en milisegundos
  gameLoop = setInterval(loopJuego, 300)
  // setInterval(loopJuego, 300) 
}
// x: 1, y: 0 → Mueve la serpiente a la derecha en cada actualización.
// x: -1, y: 0 → Mueve la serpiente a la izquierda.
// x: 0, y: -1 → Arriba.
// x: 0, y: 1 → Abajo.

function dibujarSerpiente(){
  ctx.fillStyle = "green";

  // dibujar cada segmento de la serpiente
  for (let segmento of serpiente){
    ctx.fillRect(segmento.x, segmento.y, tamano, tamano);
    // dibuja cada seccion de la serpiente
  }
}

// actualizar la posición de la serpiente
function moverSerpiente(){
  let nuevaCabeza = {
    x: serpiente[0].x + direccion.x*tamano,
    y: serpiente[0].y + direccion.y*tamano
  }

  serpiente.unshift(nuevaCabeza); // agregar nueva cabeza al inicio
  serpiente.pop(); // eliminar la ultima parte para simular movimiento
}

// leer las teclas del usuario
document.addEventListener("keydown", function(evento) {
  // esta parte puede ser hecha con switch para ser mas legible pero asi ya jala
  if (cambioDireccion == true){
    if (evento.key === "ArrowRight" && direccion.x !== -1 ) {
      direccion = {x:1, y:0};
      cambioDireccion = false;}
    if (evento.key === "ArrowLeft" && direccion.x !== 1) {
      direccion = {x:-1, y:0};
      cambioDireccion = false;}
    if (evento.key === "ArrowUp" && direccion.y !== 1) {
      direccion = {x:0, y:-1};
      cambioDireccion = false;}
    if (evento.key === "ArrowDown" && direccion.y !== -1) {
      direccion = {x:0, y:1};
      cambioDireccion = false;}
  }
  // evita que la serpiente de la vuelta y choque consigo misma
});

function dibujarTablero() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (comidaEspecial){
    ctx.fillStyle = "yellow";
    ctx.fillRect(comPos.x, comPos.y, tamano, tamano)}
  else{
  ctx.fillStyle = "blue";
  ctx.fillRect(comPos.x, comPos.y, tamano, tamano)}

  dibujarSerpiente();

  // dibujar texto en la parte superior
  // ctx.fillStyle = "black";
  // ctx.font = "20px Arial";
  // ctx.fillText("Puntaje: " + (puntaje), 10, 30);
}

// detectar colisiones
function perder(){
  if (serpiente[0].x < 0 || serpiente[0].y < 0 || 
    serpiente[0].x > canvas.width - tamano|| serpiente[0].y > canvas.height - tamano){
    return true;
  }
  for (segmento of serpiente.slice(1)){
    if (serpiente[0].x === segmento.x && serpiente[0].y === segmento.y){
      return true
    }
  }
}

// Crear la comida
function generarComdia(){
  let puedeComida = false;
  comidaEspecial = false;
  if (Math.random() >= 0.9){
    while (!puedeComida) {
      comPos = {
        x:Math.floor(Math.random()*(canvas.width/tamano))*tamano, 
        y:Math.floor(Math.random()*(canvas.height/tamano))*tamano};
      
      puedeComida = !serpiente.some(
        segmento => segmento.x === comPos.x && segmento.y === comPos.y
      ) 
    }
  
    ctx.fillStyle = "yellow";
    ctx.fillRect(comPos.x, comPos.y, tamano, tamano)
    comidaEspecial = true;
  } else {

  while (!puedeComida) {
    comPos = {
      x:Math.floor(Math.random()*(canvas.width/tamano))*tamano, 
      y:Math.floor(Math.random()*(canvas.height/tamano))*tamano};
    
    puedeComida = !serpiente.some(
      segmento => segmento.x === comPos.x && segmento.y === comPos.y
    ) 
  }

  ctx.fillStyle = "blue";
  ctx.fillRect(comPos.x, comPos.y, tamano, tamano)}
}

function comer(){
  if (serpiente[0].x === comPos.x && serpiente[0].y === comPos.y){
    if (comidaEspecial){
      if (serpiente.length > 1) {serpiente.pop()}
      puntaje++;
      generarComdia();
      
    }else{
    serpiente.push({...serpiente[serpiente.length - 1]});
    puntaje++;
    generarComdia();
    
  }}
  document.getElementById("puntaje").textContent = puntaje;
}

generarComdia();

function loopJuego(){
  cambioDireccion = true;
  moverSerpiente();

  if(perder()) {
    clearInterval(gameLoop);
    let reiniciar = confirm("Game Over, manco. \n\n¿Quieres jugar de nuevo?");
    if (reiniciar){
      IniciarJuego();
    } else {
      btIniciar.style.display = "block";
    }
  };

  comer();
  dibujarTablero();
  
}

btIniciar.addEventListener("click", IniciarJuego);
btReiniciar.addEventListener("click", IniciarJuego);