let mezclando = document.querySelector(".start-game").addEventListener("click", comenzarMezcla);
let interactions = 0;

function swap(idA, idB) {
    const cupA = document.getElementById("cup-1");
    const cupB = document.getElementById("cup-2");
    const cupC = document.getElementById("cup-3");

    const posA = cupA.getAttribute("data-pos");
    const posB = cupB.getAttribute("data-pos");
    const posC = cupC.getAttribute("data-pos");
    cupA.setAttribute("data-pos", posB);
    cupB.setAttribute("data-pos", posA);
    cupC.setAttribute("data-pos", posB);

    const zIndexRandom = Math.floor(Math.random() * 10);
    cupA.style.zIndex = zIndexRandom;
    cupB.style.zIndex = 10 - zIndexRandom;  
}

function comenzarMezcla() {
   
   // if (mezclando) return;
    mezclando = true;
    const maxInteractions = 10;
    alert("¡Comienza la mezcla! Presta atención a los movimientos de las copas."); 

    const intervalo = setInterval(() => {
        let v1 = Math.floor(Math.random() * 3);
        let v2 = Math.floor(Math.random() * 3);
        let v3 = Math.floor(Math.random() * 3);

        while (v1 === v2) v2 = Math.floor(Math.random() * 3);
        while (v1 === v3 || v2 === v3) v3 = Math.floor(Math.random() * 3);
        swap(v1, v2);
        swap(v2, v3);

        interactions++;
        if (interactions >= maxInteractions) {
            clearInterval(intervalo);
            mezclando = false;
            console.log("¡Mezcla terminada! ¿Dónde está la bolita?"); 
        }
    }, 400);
}
function seleccionarVaso(pos) {
    if (mezclando)
        alert("¡Espera a que termine la mezcla!");
        return;
    }  