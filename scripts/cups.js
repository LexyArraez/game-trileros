let mezclando = false;
document.querySelector(".start-game").addEventListener("click", comenzarMezcla);
let interactions = 0;

function swap(index1, index2) {
    const cups = [document.getElementById("cup-1"), document.getElementById("cup-2"), document.getElementById("cup-3")];
    const cup1 = cups[index1];
    const cup2 = cups[index2];

    // Intercambiar data-pos
    const tempPos = cup1.getAttribute("data-pos");
    cup1.setAttribute("data-pos", cup2.getAttribute("data-pos"));
    cup2.setAttribute("data-pos", tempPos);

    // Cambiar zIndex para simular movimiento
    const zIndexRandom = Math.floor(Math.random() * 10);
    cup1.style.zIndex = zIndexRandom;
    cup2.style.zIndex = 10 - zIndexRandom;
    cups[3 - index1 - index2].style.zIndex = Math.floor(Math.random() * 10); // La tercera copa
}

function comenzarMezcla() {
    if (!mezclando) {
        mezclando = true;
        interactions = 0;
        const maxInteractions = 10;
        
        const intervalo = setInterval(() => {
            let v1 = Math.floor(Math.random() * 3);
            let v2 = Math.floor(Math.random() * 3);
            while (v1 === v2) v2 = Math.floor(Math.random() * 3);
            swap(v1, v2);

            interactions++;
            if (interactions >= maxInteractions) {
                clearInterval(intervalo);
                mezclando = false;
                console.log("¡Mezcla terminada! ¿Dónde está la bolita?");
            }
        }, 400);
    }
    else {
        alert("Ya se está mezclando. Espera a que termine.");
    }

}
function seleccionarVaso(pos) {
    if (mezclando) {
        alert("¡Espera a que termine la mezcla!");
        return;
    }
}  