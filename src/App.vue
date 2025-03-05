<template>
  <button @click="showMenu" v-if="!isMenuOpen">
    {{ isMenuOpen ? "⬇️" : "⬆️" }}
  </button>

  <div class="ChatContainer" :class="{ open: isMenuOpen }">
    <div class="firstq">
      <h1>Hej Bygg-Bengt här!</h1>
      <p>Vill du få en offert inom 5 minuter?</p>
      <button @click="startForm()" class="yes">Ja</button>
      <button class="no" @click="hideBot()">Nej</button>
    </div>
    <form>
      <div class="question">
        <h1 class="qTitle"></h1>
        <p class="qText"></p>
      </div>
      <div class="answer"></div>
    </form>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { ref } from "vue";
let currentQ = 0;

const isMenuOpen = ref(false);
const showMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const startForm = () => {
  document.querySelector(".firstq").style = "display: none";

  document.querySelector(".qTitle").textContent = "Vilken offert gäller det?";

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
  const qTitle = document.querySelector(".qTitle");

  qTitle.textContent = q.title;

  qDiv.innerText = q.text;

  const input = document.createElement(q.element);

  if (q.type === "slider") {
    input.classList.add(q.type);
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
      optionEl.classList.add(q.type);
      optionEl.setAttribute("id", option);
      optionLab.textContent = option;
      optionLab.setAttribute("for", option);
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
      title: "Vägglängd",
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
      title: "Väggdjup",
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
      title: "Tjocklek isoleringsskiva",
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
      title: "Dräneringsbrunn",
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
      title: "Hur ska bortforsling av överblivna schaktmassor lösas?",
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
      const p = document.createElement("p");
      const span = document.createElement("span");

      const value = JSON.parse(Cookies.get(question.id));
      let name = question.title;
      span.textContent = name + ": ";
      p.textContent = value;
      svar.appendChild(span);
      svar.appendChild(p);
      svarsLista.appendChild(svar);
    });
    aDiv.appendChild(svarsLista);
    document.querySelector(".qText").textContent =
      "Btw snodde alla dina kakor när du kolla bort";
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
      document.querySelector(".qTitle").innerHTML = "";

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
      document.querySelector(".qText").textContent =
        "HAHAH trodde du denna va färdig kodad kingen, palla";
      //fasadOffert();
      break;
    case "Golv":
      document.querySelector(".qText").textContent =
        "OMG säg inte att du testa denna efter fasadOffert xD";
      //golvOffert();
      break;
    default:
      console.log("Något gick fel");
  }
};
</script>

<style lang="scss">
.ChatContainer {
  position: fixed;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border-radius: 5px;
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1d4ed8;
  color: #e5e7eb;
  padding: 20px 50px;
  box-shadow: 0px 1px 10px rgba($color: #000000, $alpha: 0.2);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.3s ease-in-out;
  &.open {
    transform: scaleY(1);
  }
  .firstq {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 20px;
    text-align: center;
    h1 {
      width: 100%;
    }
    p {
      width: 100%;
    }
  }

  .question {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    .qText {
      max-width: 80ch;
    }
  }
  .answer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    .slider {
      width: 100%;
    }
    /*.slider {
      -webkit-appearance: none; 
      -moz-appearance: none; 
      appearance: none; 
      width: 100%; 
      height: 10px; 
      background: linear-gradient(
        to right,
        #06b6d4 0%,
        #06b6d4 50%,
        #ddd 50%,
        #ddd 100%
      ); 
      border-radius: 5px; 
      outline: none; 
      transition: background 0.3s;
      &:-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px; 
        height: 20px; 
        background: #1d4ed8; 
        border-radius: 50%; 
        cursor: pointer; 
        transition: background 0.3s; 
      }
      
      &:-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #1d4ed8;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.3s;
      }
      
    }*/

    .radio {
      width: 10px;
      height: 10px;
      border-radius: 50%; /* Gör knappen rund */
      border: none;
      appearance: none; /* Tar bort den inbyggda stilen på vissa webbläsare */
      background-color: white; /* Gör bakgrunden vit */
      transition: all 0.3s ease;
    }
    label {
      padding: 5px 10px;
      background-color: white;
      color: black;
      transition: all 0.3s ease;
    }
    label {
      cursor: pointer;
      &:hover {
        background-color: darkgray;
      }
    }
    .radio {
      cursor: pointer;
      &:hover {
        background-color: darkgray;
      }
    }

    .radio:checked + label {
      background-color: #06b6d4; /* Grön när vald */
      border-color: #06b6d4;
    }
    .radio:checked {
      background-color: #06b6d4; /* Grön när vald */
      border-color: #06b6d4;
    }
  }
}

#app {
  display: flex;
  justify-content: center;
  button {
    border: none;
    text-decoration: none;
    padding: 10px 20px;
    transition: all 0.3s ease;
    border-radius: 3px;
    font-size: 18px;
    margin: 0px 20px 0px 20px;
    &:hover {
      background-color: darkgrey;
      cursor: pointer;
    }
  }
  ul {
    list-style-type: none;
    padding: 0; /* Tar bort eventuell inre padding */
    margin: 0; /* Tar bort eventuell yttre margin */
    span {
      font-weight: 600;
    }
  }
}
</style>
