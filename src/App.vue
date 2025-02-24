<template>
  <div class="ChatContainer">
    <div class="firstq"><h1>Hej Bygg-Bengt här!</h1>
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
//import Coockies from 'js-cookie';
let currentQ = 0;



const startForm = () => {
  document.querySelector(".firstq").style="display: none";

document.querySelector(".qText").textContent = "Vilken offert gäller det?";

const svarsDiv = document.querySelector(".answer");

const options = ["Dränering","Fasad","Golv"];

options.forEach(option => {
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

  console.log(q.text + q.element + q.type + q.min + q.max + q.step + q.options + q.id)
  
  if(q.type === "slider"){
    input.type = "range";
  input.min = q.min;
  input.max = q.max;
  input.step = q.tep;
  input.value = (q.min+q.max)/2;
  
  const valueDisplay = document.createElement("p");
        valueDisplay.innerText = `Värde: ${input.value} meter`;

        input.oninput = () => {
            valueDisplay.innerText = `Värde: ${input.value} meter`;
        };
        aDiv.appendChild(input);
        aDiv.appendChild(valueDisplay);


  } else if (q.type === "select"){

    q.options.forEach(option => {
      const optionEl = document.createElement("option");
      optionEl.value = option;
      optionEl.innerText = option;

      input.appendChild(optionEl);
      
    });
 
  }




};

const draneringsOffert = () => {
  
  const questions = [
    { text: "Ange längden på respektive vägg alternativt hela sträckan som schaktats upp. Över 70 löpmeter?", 
    element: "input",
    type: "slider", 
    min: 5, 
    max: 100, 
    step: 5, 
    options: null,
    id: 1,
  },
    {text: "Tjocklek isoleringsskiva",
    element: "select",
      type: "select",
      min: null,
      max: null,
      step: null,
      options:["100mm","200mm"],
      id: 2,
    }


  ];
  questionHandler(questions);



};
const questionHandler = (questions) => {



  const question = questions[currentQ];

  addQuestion(question);

  const continueBtn = document.createElement("button");
continueBtn.innerText = "Bekräfta";
continueBtn.onclick = () => {
  currentQ++
  //Coockies.set(q.id,input.value,{expires: 1, path: ''});
  questionHandler(questions);
  
}
document.querySelector(".answer").appendChild(continueBtn);


if(currentQ>=questions.length){
  currentQ = 0;
}


  
}


const handleResponse = (op) => {
  document.querySelector(".qText").innerHTML = "";
  document.querySelector(".answer").innerHTML = "";
  
  switch(op){
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

.ChatContainer{
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
