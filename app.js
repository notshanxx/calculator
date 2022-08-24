const result = document.getElementById("result")
const problem = document.getElementById("problem")
const historyBtn = document.getElementById("history-btn")
const historyUl = document.getElementById("history-ul")
const recentCalUl = document.getElementById("recent-calculated-ul")
let displayQuestion = ""
let question = ""
let autoSolve = false
let savedHistory = []



//check if there's a past saved History
let historyFromLocalStorage  = JSON.parse(localStorage.getItem("history"))

if(historyFromLocalStorage){
savedHistory = historyFromLocalStorage
}


//open setting options
document.getElementById("open-setting").addEventListener("click", function(){
  document.getElementById("setting").classList.toggle("setting-style")
  document.querySelector(".feather-settings").classList.toggle("counter-clockwise")
}
)

//open claculator history
historyBtn.addEventListener("click", function(){
  document.getElementById("setting").classList.toggle("setting-style")
  document.getElementById("history-ul-container").classList.toggle("history-toggle")
  
  historyList = ""
  for (i = 0; i < savedHistory.length; i++) {
    historyList += `<li>${savedHistory[i]} </li>`
  
    historyUl.innerHTML = historyList
  }
  
  
  }
)

//close history
document.getElementById("history-close").addEventListener("click", function(){
  document.getElementById("history-ul-container").classList.toggle("history-toggle")
  
})

//make user type CONFIRM to continue
document.getElementById("history-clear").addEventListener("click", function(){
  
  let clear = prompt('Type "CONFIRM" to clear calculator history')
  if(clear === "CONFIRM"){
  localStorage.removeItem('history')
  savedHistory =[]
  historyUl.innerHTML = ""
  }
  
})


//open auto solve
document.getElementById("auto-solve-btn").addEventListener("click", function(){
  
  // close setting
  document.getElementById("setting").classList.toggle("setting-style")
  
  if(autoSolve){
    autoSolve = false
    alert("You closed autosolve. You can press the equals button to solve your input")
    localStorage.setItem("autosolve", "false")
  }else{
    autoSolve = true
    alert("You opened autosolve. Your input will be automatically solve.")
    localStorage.setItem("autosolve", "true")
  }
  
})

//check last option of autosolve
if(localStorage.getItem("autosolve") === "true"){
  autoSolve = true
}else if(localStorage.getItem("autosolve") === "false"){
  autoSolve = false
}


// true = light | false = dark
let themeChange = true

document.getElementById("change-theme-btn").addEventListener("click", function(){
  
  //close setting
  document.getElementById("setting").classList.toggle("setting-style")
  //if clicked will change theme
  if(themeChange){
    themeChange = false
    localStorage.setItem("theme", "dark")
  }else{
    themeChange = true
    localStorage.setItem("theme", "light")
  }
  
  changeTheme()
})

//check last theme
if(localStorage.getItem("theme") ===  "light"){
  themeChange = true
  changeTheme()
}else if(localStorage.getItem("theme") === "dark"){
  themeChange = false
  changeTheme()
}

function changeTheme(){
  // change theme
if(themeChange){
  // light theme
document.documentElement.style.setProperty('--mainColor', '#D9D9D9')
document.documentElement.style.setProperty('--textColor', '#0A0A0A')
document.documentElement.style.setProperty('--operatoColor', '#DD3300')
}else{
  // dark theme
document.documentElement.style.setProperty('--mainColor', '#0A0A0A')
document.documentElement.style.setProperty('--textColor', '#D9D9D9')
document.documentElement.style.setProperty('--operatoColor', '#E68800')
}

}


function enter(val){
  //prevent to input number when it is a 15 digits 
  if(/\d{15}$/gm.test(question)){
    if(/\d/.test(val)){
      val = ""
    }
  }
  
  //make / and * unable to add in the first 
 if((displayQuestion === "" && question === "")&& (val === "/" || val === "*") ){
   question = ""
   displayQuestion = ""
 } else{
   /*pass the numbers the numbers will not be saved here will be saved in the function below*/
   changeOperator(val)
 }
 
//auto solve when the last of the string is a number
  if(autoSolve === true){
    if(/\d/.test(question[question.length - 1])){
      result.textContent = `= ${eval(question)}`
    }
  }
}

function changeOperator(val){
  
let getLast = question.substr(question.length - 1)

//no double operator
 if( (getLast === "-" || getLast === "+" || getLast === "*" || getLast === "/") && (val === "-" || val === "+" || val === "*" || val === "/") ){
   //remove last operator and add the new val
    question = question.slice(0, -1)
    question += val
    displayQuestion = displayQuestion.slice(0, -1)
    displayQuestion += val
  }else if(val === "." && getLast === "."){
    question += ""
    displayQuestion += ""
  }else{
    //where all number are added
    //all number will be added
    question += val
    displayQuestion += val
  }
  
    //check if the last is * to / and change it to × to ÷ and add spaces
  if (displayQuestion.substr(displayQuestion.length - 1) === "*") {
      displayQuestion = displayQuestion.slice(0, -1)
      displayQuestion += "×"
    } else if (displayQuestion.substr(displayQuestion.length - 1) === "/") {
      displayQuestion = displayQuestion.slice(0, -1)
      displayQuestion += "÷"
    } else if(displayQuestion.substr(displayQuestion.length - 1) === "+"){
      displayQuestion = displayQuestion.slice(0, -1)
      displayQuestion += "+"
    } else if(displayQuestion.substr(displayQuestion.length - 1) === "-"){
      displayQuestion = displayQuestion.slice(0, -1)
      displayQuestion += "-"
    } else{
      displayQuestion = displayQuestion
    }
  
 
  
  
  problem.textContent = displayQuestion
}

//solve the question
function solve(){
  
  if(question === ""){
    result.textContent = ""
  }else{
  result.textContent = `= ${Function("return " + question)()}`
  
  //push the solved question
  savedHistory.push(`${displayQuestion} = ${Function("return " + question)()}`)
  //then set it to the localStorage
  localStorage.setItem("history", JSON.stringify(savedHistory))
  recentCalUl.innerHTML += `<li>${displayQuestion} <br/>= ${eval(question)}</li>`
  }
  
  question = `${Function("return " + question)()}`
  displayQuestion = `${Function("return " + question)()}`
  problem.textContent = displayQuestion
}
  
//Clear All
function clearInput(){
  displayQuestion = ""
  question = ""
  result.textContent = ""
  problem.textContent = displayQuestion
}

//Clear last input
function del(){
 question = question.slice(0, -1)
 displayQuestion = displayQuestion.slice(0, -1)
 problem.textContent = displayQuestion
 
 let questionAutoSolve = question
 let getLast = questionAutoSolve.substr(questionAutoSolve.length - 1)
 if(autoSolve === true){
      if(getLast === "+" || getLast === "-" || getLast === "*" || getLast === "/"){
        questionAutoSolve = questionAutoSolve.slice(0 , -1)
        result.textContent = `= ${eval(questionAutoSolve)}`
      }else if(questionAutoSolve === ""){
        result.textContent = ""
      }else
      result.textContent = `= ${eval(questionAutoSolve)}`
    }
  }


 
