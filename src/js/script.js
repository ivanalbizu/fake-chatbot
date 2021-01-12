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
let number = -1
let total = 0
let generalAnswer = localStorage.getItem('generalAnswer')
generalAnswer = generalAnswer ? JSON.parse(generalAnswer) : {}

let answer = localStorage.getItem('answer')
answer = answer ? JSON.parse(answer) : {}

const startValidation = (fields, next) => {
  const target = event.target
  const name = target.getAttribute('name')

  generalAnswer[name] = target.value
  localStorage.setItem('generalAnswer', JSON.stringify(generalAnswer))
  let requires = fields.length

  for(var i=0; i < fields.length; i++){    
    if(fields[i].checkValidity()) requires--
  }
  if (requires === 0) next.removeAttribute("disabled")
  else next.setAttribute("disabled", true)
}
const startQuestion = event => {
  event.target.style.display = 'none'
  number++
  const dataQuestionNumber = document.querySelector(`[data-number="${number}"]`)
  const fields = dataQuestionNumber.querySelectorAll('input')
  const next = dataQuestionNumber.querySelector('.js-btn-continue')
  //console.log('fields :>> ', fields);
  dataQuestionNumber.setAttribute('data-current', true)
  fields.forEach(field => field.addEventListener('change', startValidation.bind(null, fields, next), false))
  next.addEventListener('click', loadQuestion, false)
}

const loadQuestion = () => {
  number++
  document.querySelector(`[data-number="${number-1}"]`).setAttribute('data-current', false)
  const dataQuestionNumber = document.querySelector(`[data-number="${number}"]`)
  dataQuestionNumber.setAttribute('data-current', true)

  if(dataQuestionNumber.classList.contains('question')) {
    // se trata de formulario
    const inputs = dataQuestionNumber.querySelectorAll('input')
    inputs.forEach(input => input.addEventListener('change', selected, false))
  } else if(dataQuestionNumber.querySelector('.js-btn-continue')) {
    // no existn inputs, por tanto se trata de video
    const video = dataQuestionNumber.querySelector('video')
    video.play()
    video.addEventListener('ended', () => {
      const next = dataQuestionNumber.querySelector('.js-btn-continue')
      next.style.visibility = 'visible'
      //next.removeAttribute("disabled")
      next.addEventListener('click', loadQuestion, false)
    }, false);
  }
}
const selected = () => {
  const dataQuestionNumber = document.querySelector(`[data-number="${number}"]`)
  const questionID = dataQuestionNumber.getAttribute('id')
  const checked = dataQuestionNumber.querySelector(`input[name]:checked`).value
  answer[questionID] = checked
  localStorage.setItem('answer', JSON.stringify(answer))

  const next = dataQuestionNumber.querySelector('.js-btn-continue')
  next.removeAttribute("disabled")
  next.addEventListener('click', loadQuestion, false)
}
/*
const nextQuestion = () => {
  loadQuestion()
  document.querySelector(`[data-number="${number-1}"]`).setAttribute('data-current', false)
}
*/
document.addEventListener('DOMContentLoaded', () => {

  const start = document.querySelector('.js-btn-start')
  let total = document.querySelectorAll('[data-number]').length
  console.log('total :>> ', total);

  start.addEventListener('click', startQuestion, false)
})