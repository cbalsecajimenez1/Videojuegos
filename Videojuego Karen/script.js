// 🧠 Referencias DOM
const grid = document.getElementById("grid");
const intentosEl = document.getElementById("intentos");
const parejasEl = document.getElementById("parejas");
const pantallaInicial = document.getElementById("pantalla-inicial");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFinal = document.getElementById("pantalla-final");
const btnJugar = document.getElementById("btnJugar");
const btnReiniciar = document.getElementById("btnReiniciar");

// 🔊 Audios
const sonidoIncorrecto = new Audio("sound/incorrect.mp3");
const sonidoCorrecto = new Audio("sound/correct.mp3");
const musicaFondo = new Audio("sound/Amor en 8 bits.mp3");
musicaFondo.loop = true;
musicaFondo.volume = 0.4;

let intentos = 0;
let parejas = 0;
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;

const imagenes = [
  "images/pt1.jpg",
  "images/pt2.jpg",
  "images/pt3.jpg",
  "images/pt4.jpg",
  "images/pt5.jpg",
  "images/pt6.jpg",
];

let cartas = [...imagenes, ...imagenes];

btnJugar.addEventListener("click", iniciarJuego);
btnReiniciar.addEventListener("click", volverAlInicio);

function iniciarJuego() {
  musicaFondo.play();
  pantallaInicial.classList.add("oculto");
  pantallaFinal.classList.add("oculto");
  pantallaJuego.classList.remove("oculto");
  crearTablero();
}

function mezclar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function crearTablero() {
  grid.innerHTML = "";
  cartas = mezclar(cartas);
  intentos = 0;
  parejas = 0;
  intentosEl.textContent = 0;
  parejasEl.textContent = "0 / 6";

  cartas.forEach((src) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="images/anverso.png" alt="anverso" />
        </div>
        <div class="card-back">
          <img src="${src}" alt="recuerdo" />
        </div>
      </div>
    `;
    card.addEventListener("click", () => voltearCarta(card));
    grid.appendChild(card);
  });
}

function voltearCarta(card) {
  if (bloqueo || card.classList.contains("flipped")) return;
  card.classList.add("flipped");

  if (!primeraCarta) {
    primeraCarta = card;
    return;
  }

  segundaCarta = card;
  intentos++;
  intentosEl.textContent = intentos;
  verificarPareja();
}

function verificarPareja() {
  const img1 = primeraCarta.querySelector(".card-back img").src;
  const img2 = segundaCarta.querySelector(".card-back img").src;

  if (img1 === img2) {
    parejas++;
    parejasEl.textContent = `${parejas} / 6`;
    sonidoCorrecto.currentTime = 0;
    sonidoCorrecto.play();
    reiniciarSeleccion();

    if (parejas === 6) {
      setTimeout(() => mostrarPantallaFinal(), 800);
    }
  } else {
    bloqueo = true;
    sonidoIncorrecto.currentTime = 0;
    sonidoIncorrecto.play();
    if (navigator.vibrate) navigator.vibrate(200);

    setTimeout(() => {
      primeraCarta.classList.remove("flipped");
      segundaCarta.classList.remove("flipped");
      reiniciarSeleccion();
    }, 1000);
  }
}

function reiniciarSeleccion() {
  [primeraCarta, segundaCarta, bloqueo] = [null, null, false];
}

function mostrarPantallaFinal() {
  musicaFondo.pause();
  pantallaJuego.classList.add("oculto");
  pantallaFinal.classList.remove("oculto");
}

function volverAlInicio() {
  musicaFondo.currentTime = 0;
  pantallaFinal.classList.add("oculto");
  pantallaInicial.classList.remove("oculto");
}
