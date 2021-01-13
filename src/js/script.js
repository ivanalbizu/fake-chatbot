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

const urlApi = 'https://api.apispreadsheets.com/data/6391/'
let number = -1
let total = 0
let answer = localStorage.getItem('answer')
answer = answer ? JSON.parse(answer) : {}

const startValidation = (fields, next) => {
  const target = event.target
  const name = target.getAttribute('name')

  answer[name] = target.value
  localStorage.setItem('answer', JSON.stringify(answer))
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
    video.playbackRate = 6.0
    video.play()
    video.addEventListener('ended', () => {
      const next = dataQuestionNumber.querySelector('.js-btn-continue')
      next.style.visibility = 'visible'
      //next.removeAttribute("disabled")
      next.addEventListener('click', loadQuestion, false)
    }, false)
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
const dataStorage = () => {
  let data = JSON.parse(localStorage.getItem('answer'))
  data.timestamp = Date.now()
  return JSON.stringify({"data":data})
}
const sendingData = () => {
  const time = 300
  let counterInverval = 0
  const documentTitle = [
    "Hemos",
    "vendido",
    "tus",
    "datos"
  ]
  const title = document.title

  const interval = setInterval(() => {
    if (documentTitle.length === counterInverval) counterInverval = 0
    document.title = documentTitle[counterInverval]
    counterInverval++
  }, time)
  const mensajeBox = document.querySelector('.mensaje')
  mensajeBox.style.display = 'flex'
  return { title, interval, mensajeBox }
}
const receivingData = (title, interval, mensajeBox) => {
  mensajeBox.style.display = 'none'
  clearInterval(interval)
  document.title = title
}
const subForm = () => {
  const { title, interval, mensajeBox } = sendingData()

  fetch(urlApi, {
    method: "POST",
    body: dataStorage(),
      }).then(res =>{
        if (res.status === 201){
          receivingData(title, interval, mensajeBox)
          console.log("Form Data Submitted :)")
        }
        else{
          receivingData(title, interval, mensajeBox)
          alert("There was an error :(")
        }
      })
}


document.addEventListener('DOMContentLoaded', () => {
  const start = document.querySelector('.js-btn-start')
  let total = document.querySelectorAll('[data-number]').length

  start.addEventListener('click', startQuestion, false)

  document.querySelector('.js-submit').addEventListener('click', subForm, false)

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

  var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral'];
  var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();

  speechRecognitionList.addFromString(grammar, 1);

  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  var diagnostic = document.querySelector('.output');
  var bg = document.querySelector('html');
  var hints = document.querySelector('.hints');

  var colorHTML= '';
  colors.forEach((v, i) => {
    console.log(v, i);
    colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
  });
  hints.innerHTML = 'Try: ' + colorHTML + '.';

  recognition.onresult = event => {
    var color = event.results[0][0].transcript;
    diagnostic.textContent = 'Result received: ' + color + '.';
    bg.style.backgroundColor = color;
    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = () => {
    recognition.stop();
  }

  recognition.onnomatch = () => {
    diagnostic.textContent = 'I didnt recognise that color.';
  }

  recognition.onerror = event => {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
  }

  document.querySelector('.js-speak').onclick = () => {
    recognition.start();
    console.log('Ready to receive a color command.');
  }
})
