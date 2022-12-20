fetch('data/targetWord.json')
.then(response => response.json())
.then(data => {
  const targetWords = data;
  fetch('data/dictionary.json')
 .then(response => response.json())
 .then(data => {
  const dictionary = data;
  const wordLenght = 5;
  const flipDuration = 500
  const danceDuration = 500
  const keyboard = document.querySelector("[data-keyboard]")
  const alertContainer = document.querySelector('[data-alert-container]')
  const guessGrid = document.querySelector('[data-guess-grid]')
  const targetWord = targetWords[Math.floor(Math.random()*targetWords.length)]
  
  startInteraction()
  
  function startInteraction() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
  }
    
  function stopInteraction() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
  }
  
  function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key)
      return
    }
  
    if (e.target.matches("[data-enter]")) {
      submitGuess()
      return
    }
  
    if (e.target.matches("[data-delete]")) {
      deleteKey()
      return
    }
  }
  
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      submitGuess()
      return
    }
  
    if (e.key === "Backspace" || e.key === "Delete") {
      deleteKey()
      return
    }
  
    if (e.key.match(/^[a-z]$/)) {
      pressKey(e.key)
      return
    }
  }
  
  function getActiveTiles(){
    return guessGrid.querySelectorAll('[data-state="active"]')
  }

  function deleteKey(){
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length - 1]
    if (lastTile == null) return
    lastTile.textContent = ""
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
  }

  function submitGuess () {
    const activeTile = [...getActiveTiles()]
    if(activeTile.length !== wordLenght){
        showAlert("NOt LONG ENOUGHF")
        shakeTile(activeTile)
        return
    }

    const guess = activeTile.reduce((word,tile) => {
        return word + tile.dataset.letter
    },"")

    if(!dictionary.includes(guess)){
        showAlert("not in word list")
        shakeTile(activeTile)
        return
    }

    stopInteraction()
    activeTile.forEach((...para)=> {
        flipTiles(...para, guess)

    })
  }

  function flipTiles(tile,index, array , guess){
    const letter = tile.dataset.letter
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)
    setTimeout(() => {
      tile.classList.add("flip")
    }, (index * flipDuration) / 2)

    tile.addEventListener(
      "transitionend",
      () => {
        tile.classList.remove("flip")
        if (targetWord[index] === letter) {
          tile.dataset.state = "correct"
          key.classList.add("correct")
        } else if (targetWord.includes(letter)) {
          tile.dataset.state = "wrong-location"
          key.classList.add("wrong-location")
        } else {
          tile.dataset.state = "wrong"
          key.classList.add("wrong")
        }

        if (index === array.length - 1) {
          tile.addEventListener(
            "transitionend",
            () => {
              startInteraction()
              checkWinLose(guess, array)
            },
            { once: true }
          )
        }
      },
      { once: true }
   )
  }

  function pressKey(key) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= wordLenght) return
    const nextTile = guessGrid.querySelector(":not([data-letter])")
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = "active"
  }
  
  function showAlert(message, duration = 1000){
      const alert = document.createElement("div")
      alert.textContent = message
      alert.classList.add("alert")
      alertContainer.prepend(alert)
      if(duration == null)return
      setTimeout(() => {
          alert.classList.add("hide")
          alert.addEventListener("transitionend", () => {
              alert.remove()
          })
      }, duration)
  }
  
  function shakeTile(tile){
      tile.forEach(tile => {
          tile.classList.add("shake")
          tile.addEventListener("animationend", () => {
              tile.classList.remove("shake")
          },{ once : true})
  
      })
  }
  
  
  function checkWinLose(guess, tiles) {
      if (guess === targetWord) {
        showAlert("You Win", 5000)
        danceTiles(tiles)
        stopInteraction()
        return
      }
  }
  
  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
      showAlert(targetWord.toUpperCase(), null)
      stopInteraction()
    }
  
  function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("dance")
        tile.addEventListener(
          "animationend",
          () => {
            tile.classList.remove("dance")
          },
          { once: true }
        )
      }, (index * danceDuration) / 5)
    })}
})
});