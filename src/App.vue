<template>
  <div class="ChatContainer">
    <div class="firstq">
      <h1>Hej Bygg-Bengt här!</h1>
      <p>Vill du få en offert inom 5 minuter?</p>
      <button @click="startForm()" class="yes">Ja</button>
      <button class="no">Nej</button>
    </div>
    <form>
      <div class="question"><p class="qText"></p></div>
      <div class="answer"></div>
    </form>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
let currentQ = 0;

const startForm = () => {
  document.querySelector(".firstq").style = "display: none";

  document.querySelector(".qText").textContent = "Vilken offert gäller det?";

  const svarsDiv = document.querySelector(".answer");

  const options = ["Dränering", "Fasad", "Golv"];

  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => handleResponse(option);
    svarsDiv.appendChild(btn);
  });
};

const addQuestion = (q) => {
  const aDiv = document.querySelector(".answer");
  const qDiv = document.querySelector(".qText");
  qDiv.innerText = q.text;

  const input = document.createElement(q.element);

  if (q.type === "slider") {
    input.type = "range";
    input.name = q.id;
    input.min = q.min;
    input.max = q.max;
    input.step = q.step;
    input.value = (q.min + q.max) / 2;

    const valueDisplay = document.createElement("p");
    valueDisplay.innerText = `Värde: ${input.value} meter`;

    input.oninput = () => {
      valueDisplay.innerText = `Värde: ${input.value} meter`;
    };
    aDiv.appendChild(input);
    aDiv.appendChild(valueDisplay);
  } else if (q.type === "radio") {
    q.options.forEach((option) => {
      const optionEl = document.createElement("input");
      const optionLab = document.createElement("label");
      optionLab.textContent = option;
      optionEl.type = q.type;
      optionEl.value = option;

      optionEl.name = q.id;
      aDiv.appendChild(optionEl);
      aDiv.appendChild(optionLab);
    });
  }
};

const draneringsOffert = () => {
  const questions = [
    {
      text: "Ange längden på respektive vägg alternativt hela sträckan som schaktats upp. Över 70 löpmeter?",
      element: "input",
      type: "slider",
      min: 1,
      max: 70,
      step: 1,
      options: null,
      id: 1,
    },
    {
      text: "Väggdjup är måttet från marknivå till golvet i källare. För att räkna ut det gör enligt följande 1. Mät från innergolv upp till ett källarfönsters underkant. (X) 2. Mät på utsidan från fönstrets underkant ner till marknivå. (Y) 3. Beräkna enligt följande: Väggdjup = X - Y",
      element: "input",
      type: "slider",
      min: 0.1,
      max: 4.0,
      step: 0.1,
      options: null,
      id: 2,
    },
    {
      text: "100 mm tjocklek ger mycket bra fuktsäkerhet och värmeisolering. 200 mm uppfyller kraven enligt Boverkets regler ur energisynpunkt vid nyproduktion eller byggnadslovspliktig utbyggnad. Med 200 mm får du alltid dubbel dräneringskapacitet, ännu större uttorkning av väggen och lägre energiförbrukning jämfört med 100 mm.",
      element: "input",
      type: "radio",
      min: null,
      max: null,
      step: null,
      options: ["100mm", "200mm"],
      id: 3,
    },
    {
      text: "Vilken typ av dräneringsbrunn som ska användas avgörs av vilka möjligheter som finns att på ett säkert sätt avleda dräneringsvattnet från fastigheten. Vi har tagit fram lösningar för de vanligaste förekommande fallen.",
      element: "input",
      type: "radio",
      min: null,
      max: null,
      step: null,
      options: [
        "Pumpbrunn (vanligast)",
        "Dräneringsbrunn utan pump",
        "Egen lösning",
      ],
      id: 4,
    },
    {
      text: "Välj om överblivna schaktmassor ska förslas bort eller om du behandlar massorna på egen hand. Tänk på att det blir ca 40 - 50 kubikmeter schaktmassor kvar efter återfyllningen.",
      element: "input",
      type: "radio",
      min: null,
      max: null,
      step: null,
      options: ["Entreprenören forslar bort", "Egen Bortforsling"],
      id: 5,
    },
  ];
  questionHandler(questions);
};
const questionHandler = (questions) => {
  let svar;
  if (currentQ >= questions.length) {
    const aDiv = document.querySelector(".answer");
    const svarsLista = document.createElement("ul");
    questions.forEach((question) => {
      const svar = document.createElement("li");

      const value = JSON.parse(Cookies.get(question.id));

      svar.textContent = value;
      svarsLista.appendChild(svar);
    });
    aDiv.appendChild(svarsLista);
  } else {
    const question = questions[currentQ];
    addQuestion(question);

    const continueBtn = document.createElement("button");
    continueBtn.innerText = "Bekräfta";
    continueBtn.onclick = () => {
      if (question.type === "slider") {
        svar = document.querySelector(`input[name= "${question.id}"]`);
      } else if (question.type === "radio") {
        svar = document.querySelector(`input[name= "${question.id}"]:checked`);
      }
      Cookies.set(question.id, JSON.stringify(svar.value), {
        expires: 1,
        path: "",
      });

      currentQ++;

      document.querySelector(".answer").innerHTML = "";
      document.querySelector(".qText").innerHTML = "";

      questionHandler(questions);
    };
    const aDiv = document.querySelector(".answer");
    aDiv.appendChild(continueBtn);
  }
};

const handleResponse = (op) => {
  document.querySelector(".qText").innerHTML = "";
  document.querySelector(".answer").innerHTML = "";

  switch (op) {
    case "Dränering":
      draneringsOffert();
      break;
    case "Fasad":
      //fasadOffert();
      break;
    case "Golv":
      //golvOffert();
      break;
    default:
      console.log("Något gick fel");
  }
};
</script>

<style lang="scss">
.ChatContainer {
  border: 2px solid black;
  border-radius: 5px;
  width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#app {
  display: flex;
  justify-content: center;
}
</style>
