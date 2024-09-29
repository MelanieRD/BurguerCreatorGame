let capaBurguer = 0;
let topValue = 70;
let zIndexValue = 0;
let burguerIngredientsArray = [];
let Score = 0;

function docLoad() {
  randomOrderCreator();

  setInterval(() => {
    if (OrdersnotCompleate.length < 6) {
      randomOrderCreator();
    }
    if (OrdersnotCompleate.length >= 6) {
      document.getElementById("audioLose").play();
      swal({
        tile: "¡Perdiste!",
        text: "Dejaste juntar muchas ordenes",
        icon: "error",
        buttons: "Reiniciar Juego",
      }).then(() => {
        location.reload();
      });
    }
  }, 7000);
}

function addIngredient(ingredientCode, ingredientName) {
  document.getElementById("audioIngrediente").play();
  let ingredientHTML = `
<div class="addedIngredient" id="addedIng">
<img src="src/img/burguer/${ingredientCode}.png"/>
</div>
`;

  if (capaBurguer !== 10) {
    if (ingredientCode == 1) {
      topValue -= 6;
      // console.log(topValue);
    }

    topValue -= 3;
    capaBurguer++;
    zIndexValue++;

    document
      .getElementById("burguerContainer")
      .insertAdjacentHTML("afterbegin", ingredientHTML);

    document.getElementById("addedIng").style.top = `${topValue}%`;
    document.getElementById("addedIng").style.zIndex = `${zIndexValue}`;

    //  console.log(capaBurguer);
    console.log("TopValue: " + topValue);
    burguerIngredientsArray.push({ id: ingredientCode, name: ingredientName });
    console.log(burguerIngredientsArray);
  }
}

//Hacer que se pongan en verder cuando coloque algun elemento en mi haburguesa de la orden.

let orderCompleate = false;
function BurguerHasIngredient() {
  let burguerCreated = [];
  let puntajeFallos = 0;
  let puntaje = 0;

  if (orderSelectedToCook !== undefined) {
    burguerIngredientsArray.forEach((element) => {
      burguerCreated.push(element.id);
    });

    let burguerReverse = burguerCreated.reverse();
    //tengo que arreglar cuando el array de hamburguesa creada es mas grande que la orden, para que valide y quite puntos por los elementos extras;
    for (let i = 0; i < orderSelectedToCook.ingredients.length; i++) {
      if (orderSelectedToCook.ingredients[i] === burguerReverse[i]) {
        puntaje += 25;
        console.log(
          `son iguales:  ${orderSelectedToCook.ingredients[i]} Y ${burguerReverse[i]}`
        );

        // document.getElementById("pointsPositive").innerText = puntaje;
        scoreChanger(puntaje, i, (green = true));
      } else if (!orderSelectedToCook.ingredients[i] !== burguerReverse[i]) {
        puntajeFallos -= 30;
        console.log(
          `NO son iguales:  ${orderSelectedToCook.ingredients[i]} Y ${burguerReverse[i]}`
        );

        scoreChanger(puntajeFallos, i, (green = false));
      }
      console.log(
        `Arrays a inspeccionar: ${orderSelectedToCook.ingredients} Y ${burguerReverse} `
      );
    }

    console.log(
      `puntaje: ${puntaje}, las fallas te han costado: ${puntajeFallos}`
    );

    Score += puntaje + puntajeFallos;

    puntaje = 0;
    puntajeFallos = 0;
    document.getElementById("scoreh3").innerText = `Score: ${Score}`;
    orderCompleate = true;

    setTimeout(() => {
      if (Score >= 1000) {
        document.getElementById("audioWin").play();
        swal({
          tile: "¡Buen Trabajo!",
          text: "Ganaste dos bolivares, ten",
          icon: "success",
          buttons: "Reiniciar Juego",
        }).then(() => {
          location.reload();
        });

        document.getElementById("audioWin").play();
      } else if (Score < 0) {
        document.getElementById("audioLose").play();
        swal({
          tile: "¡Perdiste!",
          text: "Perdiste, me debes 500 pesos, cuenta popular: 824019830",
          icon: "error",
          buttons: "Reiniciar Juego",
        }).then(() => {
          location.reload();
        });
      }
    }, 1000);
  }

  function scoreChanger(puntaje, i, green) {
    setTimeout(() => {
      let puntajeHtml = `<h3 id="points" class="animated">${puntaje}</h3>`;

      document
        .getElementById("burguerContainer")
        .insertAdjacentHTML(
          "afterbegin",
          `<h3 id="points" class="animated">${(puntaje -= 30)}</h3>`
        );

      if (green) {
        document.getElementById("points").style.color = "green";
      }
    }, 200 * i);

    setTimeout(() => {
      document.getElementById("points").remove();
    }, 300 * i);
  }
}

function sendBurguer() {
  //Aqui voy hacer que puedan enviar las burguers, pero antes, hare un evento listener que capture el numero de la orden al hacer click, asi poder entregar la orden que queramos

  let warning = document.getElementById("warning");
  if (burguerIngredientsArray.length !== 0) {
    if (orderSelectedToCook) {
      BurguerHasIngredient();
      document.getElementById("audioSend").play();
    } else {
      warning.innerText = "Debes seleccionar una orden para entregar";
      document.getElementById("audioError").play();
      setTimeout(() => {
        warning.innerHTML = "";
      }, 2000);
    }
    if (orderCompleate) {
      setTimeout(() => {
        eliminarOrdenCompletada();
      }, 1000);
    }
  } else {
    warning.innerText = "Tienes que crear una hamburguesa antes de entregar";
    document.getElementById("audioError").play();
    setTimeout(() => {
      warning.innerHTML = "";
    }, 2000);
  }
}

function eliminarOrdenCompletada() {
  document.getElementById(`order${orderSelectedToCook.id}`).remove();
  orderCompleate = false;
  burguerIngredientsArray = [];
  const ingBurguerDivs = document.querySelectorAll(".addedIngredient");
  ingBurguerDivs.forEach((div) => {
    div.remove();
  });

  capaBurguer = 0;
  topValue = 50;
  zIndexValue = 0;

  // eliminar la orden de aqui OrdersnotCompleate

  OrdersnotCompleate.splice(
    OrdersnotCompleate.findIndex(
      (order) => order.id === orderSelectedToCook.id
    ),
    1
  );

  console.log("ordenes restantes: " + OrdersnotCompleate.length);
  orderSelectedToCook = undefined;
}

let orderSelectedToCook;

function orderSelector(numOrderSelected) {
  const itemsOrders = document.querySelectorAll(".order");
  itemsOrders.forEach((order) => {
    if (order.id === `order${numOrderSelected}`) {
      document.getElementById(order.id).style.border = "3px solid green";
    } else {
      document.getElementById(order.id).style.border = "none";
    }
  });

  console.log(`Orden: ${numOrderSelected}`);

  orderSelectedToCook = OrdersnotCompleate.find(
    (order) => order.id === numOrderSelected
  );

  console.log(`numOrderSelected: ${orderSelectedToCook.ingredients}`);
}

let numOrder = 1; //Contador de ordenes
let OrdersnotCompleate = []; // Aqui se empujan mis ordenes no completadas

function randomOrderCreator() {
  document.getElementById("audioOrder").play();
  let randomNum = Math.floor(Math.random() * 8 + 1);
  let orderHamb = [1]; //Tiene un uno porque ese uno es la parte de arriba de la hamburguesa y debe ser 1 para que sea esa parte siempre

  let orderHtml = `
      <div class="order" id="order${numOrder}" onclick="orderSelector(${numOrder})">
          <h3>Orden #${numOrder}</h3>
          <p>
            Ingredientes
            <ul id="ingredientesUl${numOrder}">
             
            </ul>
          </p>
        </div>
  `;

  for (let i = 0; i <= randomNum; i++) {
    let numIngredients = Math.floor(Math.random() * 6);
    if (numIngredients !== 1 && numIngredients !== 0) {
      orderHamb.push(numIngredients);
    }
  }
  orderHamb.push(7); // Para que siempre me cierre la Hamburguer

  document
    .getElementById("ordersContainer")
    .insertAdjacentHTML("beforeend", orderHtml);

  // console.log("Orden de Hamburguesa Ingredientes: " + orderHamb);
  // Bro aqui esta el array random, hay que retornarlo y enviarlo a la lista

  let ingredientesNombres = [
    { id: 1, name: "Pan superior" },
    { id: 2, name: "Carne" },
    { id: 3, name: "Cebolla" },
    { id: 4, name: "Tomate" },
    { id: 5, name: "Queso" },
    { id: 6, name: "Lechuga" },
    { id: 7, name: "Pan inferior" },
  ];

  // Estoy intentando de hacer un array que guarde cada una de las ordenes creadas, para luego hacer hamburguesas y compararlas, y de esta manera entregar hamburguesas.
  //1. Ya mi orderHam me guarda los ingredientes que debe de terner mi hambuerguesa, supongo que con esto es suficiente para saber como esta constituida mi hamburguesa
  // es decir, esto podria ser mi orden. (REALIZADO)

  orderHamb.forEach((element, elementIndex) => {
    const ingredienteLi = document.createElement("li");
    let ingredienteObj = ingredientesNombres.find((i) => i.id === element);
    ingredienteLi.innerText = `${elementIndex + 1}. ${ingredienteObj.name}`;

    document
      .getElementById(`ingredientesUl${numOrder}`)
      .insertAdjacentElement("beforeend", ingredienteLi);
  });

  OrdersnotCompleate.push({ id: numOrder, ingredients: orderHamb });
  // console.log(OrdersnotCompleate);
  numOrder++; // Pa saber en que orden tamos y poder subir los ingredientes a sus respectivos divs de orders;
}

/**
 * Funcionalidades principales
 *
 * 1. Agregar ingredientes (AGREGADO)
 * 2. Colocar ingredientes en el main (AGREGADO)
 * 3. Creador de ordenes randoms (AGREGADO)
 * 4. Hojas de ordenes (AGREGADO)
 * 5.
 *
 *
 *
 *
 */
