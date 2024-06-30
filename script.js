//variables a utilizar
var altura = 6;
var longitud = 5;

var fila = 0
var columna = 0;

var terminoElJuego = false;
var palabra;
var respuesta = document.getElementById("respuesta")
//Se saca una palabra aleatoria de la API o de una arreglo
fetch("https://random-word-api.herokuapp.com/word?length=5")
  .then(response => response.json())
  .then(response => {
    palabra = response[0].toUpperCase();
    console.log(palabra);
  } )
  .catch(err =>{
    let listaPalabras = ["APPLE", "MOUSE", "HOUSE", "TRACE"];
    let posicion = Math.floor(Math.random() * listaPalabras.length);
    palabra= listaPalabras[posicion]; 
    console.log(palabra);
  })


window.onload = function () {
  iniciar();
}

//Se crean las cajas en donde se va a realizar el juego
function iniciar() {
  for (let i = 0; i < altura; i++) {
    for (let j = 0; j < longitud; j++) {
      let caja = document.createElement("span");
      caja.id = i.toString() + "-" + j.toString();
      caja.classList.add("caja");
      caja.innerText = "";
      document.getElementById("tablero").appendChild(caja);
    }
  }
}

//Registra las teclas presionadas y las escribe en las cajas
document.addEventListener("keyup", (e) => {
  if (terminoElJuego) return;

  if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (columna < longitud) {
      let cajaActual = document.getElementById(fila.toString() + "-" + columna.toString());
      if (cajaActual.innerText == "") {
        cajaActual.innerText = e.code[3];
        columna++;
      }
    }
  }

  else if (e.code == "Backspace") {
    if (0 < columna && columna <= longitud) {
      columna--;
    }
    let cajaActual = document.getElementById(fila.toString() + "-" + columna.toString());
    cajaActual.innerText = "";
  }

  else if (e.code == "Enter") {
    if(columna == longitud){  
      actualizar();
      fila++;
      columna = 0
    }
  }

  if (!terminoElJuego && fila == altura) {
    terminoElJuego = true;
    respuesta.innerText = "Lo lamento perdiste :(\n La palabra era = " + palabra;
    respuesta.style.color = "white";
  }
})

//Funcion que actualiza el color de las cajas en base a tu respuesta
function actualizar() {
  let correcto = 0;
  let contadorLetras = {};
  for (let i = 0; i < longitud; i++) {
    letra = palabra[i];
    if (contadorLetras[letra]) {
      contadorLetras[letra]++;
    }
    else {
      contadorLetras[letra] = 1;
    }
  }

  for (let i = 0; i < longitud; i++) {
    let cajaActual = document.getElementById(fila.toString() + "-" + i.toString());
    let letra = cajaActual.innerText;

    if (palabra[i] == letra) {
      cajaActual.classList.add("correcto");
      cajaActual.style.borderColor = "#6AAA64";
      correcto++;
      contadorLetras[letra]--;
    }

    if (correcto == longitud) {
      terminoElJuego = true;
      respuesta.innerText = "Felicidades, ganaste :)";
      respuesta.style.color = "white";
    }
  }

  for (let i = 0; i < longitud; i++) {
    let cajaActual = document.getElementById(fila.toString() + "-" + i.toString());
    let letra = cajaActual.innerText;
    if (!cajaActual.classList.contains("correcto")) {
      if (palabra.includes(letra) && contadorLetras[letra] > 0) {
        cajaActual.classList.add("existe");
        cajaActual.style.borderColor = "#c9b458";
        contadorLetras[letra]--;
      }
      else {
        cajaActual.classList.add("incorrecto");
      }
    }
  }
}