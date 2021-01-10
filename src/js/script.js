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

document.addEventListener('DOMContentLoaded', () => {
  const start = document.querySelector('.js-btn-start')
  const question = document.querySelector('.chat__item')

  start.addEventListener('click', event => {
    console.log('questions :>> ', questions);

  })

  localStorage.setItem('questions', JSON.stringify(questions));
})