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

  for(var i=0; i < fields.length; i++) {    
    if (fields[i].checkValidity()) requires--
  }
  if (requires === 0) next.removeAttribute("disabled")
  else next.setAttribute("disabled", true)
}
const startQuestion = event => {
  let recognitionGenero = speechFactory(grammarNameGenero, grammarOptionsGenero, inputGenero)
  document.querySelector('.js-speak-genero').onclick = () => recognitionGenero.start()

  let recognitionEdad = speechFactory(grammarNameEdad, grammarOptionsEdad, inputEdad)
  document.querySelector('.js-speak-edad').onclick = () => recognitionEdad.start()

  let recognitionAltura = speechFactory(grammarNameAltura, grammarOptionsAltura, inputAltura)
  document.querySelector('.js-speak-altura').onclick = () => recognitionAltura.start()

  let recognitionPeso = speechFactory(grammarNamePeso, grammarOptionsPeso, inputPeso)
  document.querySelector('.js-speak-peso').onclick = () => recognitionPeso.start()

  let recognitionEstadoCivil = speechFactory(grammarNameEstadoCivil, grammarOptionsEstadoCivil, inputEstadoCivil)
  document.querySelector('.js-speak-estado-civil').onclick = () => recognitionEstadoCivil.start()

  let recognitionMascota = speechFactory(grammarNameMascota, grammarOptionsMascota, inputMascota)
  document.querySelector('.js-speak-mascota').onclick = () => recognitionMascota.start()

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
const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
const parse = str => Function(`'use strict'; return (${str})`)()

const loadQuestion = () => {
  number++
  document.querySelector(`[data-number="${number-1}"]`).setAttribute('data-current', false)
  const dataQuestionNumber = document.querySelector(`[data-number="${number}"]`)
  dataQuestionNumber.setAttribute('data-current', true)

  if (dataQuestionNumber.classList.contains('question')) {
    // se trata de formulario
    const inputs = dataQuestionNumber.querySelectorAll('input')
    inputs.forEach(input => input.addEventListener('change', selected, false))

    const name = capitalize(inputs[0].getAttribute('name'))
    const options = {
      "name": `grammarName${name}`,
      "option": `grammarOptions${name}`,
      "input": `input${name}`
    }
    let recognitionSingle = speechFactory(parse(options.name), parse(options.option), parse(options.input))
    dataQuestionNumber.querySelector('.js-speak-single').onclick = () => recognitionSingle.start()
  } else if (dataQuestionNumber.querySelector('.js-btn-continue')) {
    // no existn inputs, por tanto se trata de video
    const video = dataQuestionNumber.querySelector('video')
    video.playbackRate = 4.0
    video.play()
    video.addEventListener('ended', () => {
      const next = dataQuestionNumber.querySelector('.js-btn-continue')
      next.style.visibility = 'visible'
      //next.removeAttribute("disabled")
      next.addEventListener('click', loadQuestion, false)
      loadQuestion()
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
const submitData = () => {
  const { title, interval, mensajeBox } = sendingData()

  fetch(urlApi, {
    method: "POST",
    body: dataStorage(),
      }).then(res => {
        if (res.status === 201) {
          receivingData(title, interval, mensajeBox)
          console.log("Form Data Submitted :)")
        } else {
          receivingData(title, interval, mensajeBox)
          alert("There was an error :(")
        }
      })
}
let grammarNameGenero = [ 'generos', 'genero' ]
let grammarOptionsGenero = [ 'mujer' , 'hombre' ]
let inputGenero = {
  "type": "radio",
  "name": "genero"
}

let grammarNameEdad = [ 'edades', 'edad' ]
let grammarOptionsEdad = [ '20' , '21' ]
let inputEdad = {
  "type": "number",
  "name": "edad"
}

let grammarNameAltura = [ 'alturas', 'altura' ]
let grammarOptionsAltura = [ '170' , '171' ]
let inputAltura = {
  "type": "number",
  "name": "altura"
}

let grammarNamePeso = [ 'pesos', 'peso' ]
let grammarOptionsPeso = [ '80' , '81' ]
let inputPeso = {
  "type": "number",
  "name": "peso"
}

let grammarNameEstadoCivil = [ 'estados', 'estado' ]
let grammarOptionsEstadoCivil = [ 'soltero' , 'casado', 'casado con hijo' ]
let inputEstadoCivil = {
  "type": "radio",
  "name": "estado-civil"
}

let grammarNameMascota = [ 'mascotas', 'mascota' ]
let grammarOptionsMascota = [ 'si' , 'no' ]
let inputMascota = {
  "type": "radio",
  "name": "mascota"
}

let grammarNameSexo = [ 'sexos', 'sexo' ]
let grammarOptionsSexo = [ 'mujer' , 'hombre', 'indeciso', 'indefinido' ]
let inputSexo = {
  "type": "radio",
  "name": "sexo"
}

let grammarNameDesayuno = [ 'desayunos', 'desayuno' ]
let grammarOptionsDesayuno = [ 'chorizo' , 'sobrasada', 'tortilla' ]
let inputDesayuno = {
  "type": "radio",
  "name": "desayuno"
}

let grammarNameTrabajo = [ 'trabajos', 'trabajo' ]
let grammarOptionsTrabajo = [ 'trabajar' , 'duchar' ]
let inputTrabajo = {
  "type": "radio",
  "name": "trabajo"
}


const speechFactory = (grammarName, grammarOptions, input) => {

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

  var grammar = `#JSGF V1.0; grammar ${grammarName[0]}; public <${grammarName[1]}> = ${grammarOptions.join(' | ')} ;`

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();

  speechRecognitionList.addFromString(grammar, 1);

  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  var diagnostic = document.querySelector('.output');
  var hints = document.querySelector('.hints');

  var resultHTML= '';
  grammarOptions.forEach((v, i) => {
    console.log(v, i);
    resultHTML += '<span>' + v + '</span> ';
  });
  hints.innerHTML = 'Try: ' + resultHTML + '.';

  recognition.onresult = event => {
    var transcript = event.results[0][0].transcript;
    var confidence = event.results[0][0].confidence;
    diagnostic.textContent = 'Result received: ' + transcript + '.';
    console.log('confidence :>> ', confidence);
    console.log('transcript :>> ', transcript);
    console.log('typeof transcript :>> ', typeof transcript);
    if (input.type == "radio") {
      const element = document.querySelector(`input[name="${input.name}"][value="${transcript.replace(/ /g, '-')}"]`)
      element.click()
    } else if (input.type == "number") {
      // TO-DO check if entry is typeof number
      const element = document.querySelector(`input[name="${input.name}"]`)
      element.value = transcript
      answer[input.name] = transcript
      localStorage.setItem('answer', JSON.stringify(answer))
    }
  }

  recognition.onstart = () => {
    console.log('Ready to receive a command.');
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
  return recognition
}

document.addEventListener('DOMContentLoaded', () => {
  const start = document.querySelector('.js-btn-start')
  let total = document.querySelectorAll('[data-number]').length

  start.addEventListener('click', startQuestion, false)

  document.querySelector('.js-submit').addEventListener('click', submitData, false)
})
