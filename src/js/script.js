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

let number = 0
let total = 0
let answer = localStorage.getItem('answer')
answer = answer ? JSON.parse(answer) : {}

const loadQuestion = () => {
  number++
  const dataNumber = document.querySelector(`[data-number="${number}"]`)
  dataNumber.setAttribute('data-current', true)

  const inputs = dataNumber.querySelectorAll('input')

  inputs.forEach(input => input.addEventListener('change', selected, false))
  console.log('number :>> ', number);
}
const selected = () => {
  const dataNumber = document.querySelector(`[data-number="${number}"]`)
  const questionID = dataNumber.getAttribute('id')
  const checked = dataNumber.querySelector(`input[name]:checked`).value
  console.log('checked :>> ', checked);
  answer[questionID] = checked
  localStorage.setItem('answer', JSON.stringify(answer))
  const next = dataNumber.querySelector('.js-btn-continue')
  next.removeAttribute("disabled")
  next.addEventListener('click', nextQuestion, false)
}

const nextQuestion = () => {
  //const question = document.querySelector(`[data-number="${number}"]`)
  document.querySelector(`[data-number="${number-1}"]`).setAttribute('data-current', false)
  loadQuestion()
}
document.addEventListener('DOMContentLoaded', () => {

  const start = document.querySelector('.js-btn-start')
  let total = document.querySelectorAll('[data-number]').length
  console.log('total :>> ', total);

  start.addEventListener('click', loadQuestion, false)
})