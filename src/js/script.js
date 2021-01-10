let questions = [
  {
    "id": "sexo",
    "question": "Elige tu sexo",
    "answer": [
      "Mujer", "Hombre", "Indeciso", "Indefinido"
    ],
    "response": false
  },
  {
    "id": "desayuno",
    "question": "¿Que quieres desayunar?",
    "answer": [
      "Chorizo cantinpalo", "Sobrasada", "Tortilla de Betanzos"
    ],
    "response": false
  },
  {
    "id": "trabajo", 
    "question": "¿Quieres trabajar o una ducha?",
    "answer": [
      "Trabajar", "Ducha"
    ],
    "response": false
  }
]

const startChat = event => {
  console.log('event.target :>> ', event.target);
}
const selected = event => {
  const target = event.target
  const question = target.closest('.question')
  const name = target.getAttribute('name')
  const selected = question.querySelector(`input[name="${name}"]:checked`).value
  question.querySelector('.js-btn-continue').removeAttribute("disabled")
  console.log(selected)
}

const nextQuestion = event => {
  console.log('event.target :>> ', event.target)
  localStorage.setItem('questions', 'dato guardado')
}

document.addEventListener('DOMContentLoaded', () => {
  const start = document.querySelector('.js-btn-start')
  const inputs = document.querySelectorAll('input')
  const nexts = document.querySelectorAll('.js-btn-continue')

  start.addEventListener('click', startChat, false)

  inputs.forEach(input => input.addEventListener('change', selected, false))

  nexts.forEach(next => next.addEventListener('click', nextQuestion, false))

})