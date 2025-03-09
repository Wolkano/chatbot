import { createStore } from "vuex";
import { questions } from "./questions.json";

export default createStore({
  state: {
    questions,
    responses: JSON.parse(localStorage.getItem("responses")) || {},
    currentQuestionIndex:
      JSON.parse(localStorage.getItem("currentQuestionIndex")) || 0,
  },
  getters: {},
  mutations: {
    setQuestions(state, questions) {
      state.questions = questions;
    },
    saveResponse(state, { id, answer }) {
      state.responses[id] = answer;
      localStorage.setItem("responses", JSON.stringify(state.responses));
    },
    nextQuestion(state) {
      localStorage.setItem(
        "currentQuestionIndex",
        state.currentQuestionIndex + 1
      );
      state.currentQuestionIndex++;
    },
  },
  actions: {},
});
