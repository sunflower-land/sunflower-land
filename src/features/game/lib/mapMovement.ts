type MovementIntervals = {
  moveUp?: any,
  moveDown?: any,
  moveLeft?: any,
  moveRight?: any
}


const sensitivity = 3
const movementIntervals: MovementIntervals = {}
const initialCoordinates = [1024,1214]
// TODO dynamic initial coordinates based on tile dimensions

const setup = (container: any) => {
  // adding setintervals for smooth movement for each relevant keypress and removing them on keyup 
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase()
    if (container.current) {
      if (key === 'w' || key === 'arrowup') {
        if (movementIntervals.moveUp == undefined) {
          movementIntervals.moveUp = setInterval(() => {
            container.current.scrollTop -= sensitivity
          }, 5)
        }
      } else if (key === 'a' || key === 'arrowleft') {
        if (movementIntervals.moveLeft == undefined) {
          movementIntervals.moveLeft = setInterval(() => {
            container.current.scrollLeft -= sensitivity
          }, 5)
        }
      } else if (key === 's' || key === 'arrowdown') {
        if (movementIntervals.moveDown == undefined) {
          movementIntervals.moveDown = setInterval(() => {
            container.current.scrollTop += sensitivity
          }, 5)
        }
      } else if (key === 'd' || key === 'arrowright') {
        if (movementIntervals.moveRight == undefined) {
          movementIntervals.moveRight = setInterval(() => {
            container.current.scrollLeft += sensitivity
          }, 5)
        }
      } else if (key === ' '){
        container.current.scrollTop = initialCoordinates[0]
        container.current.scrollLeft = initialCoordinates[1]
        event.preventDefault()
      }
    }
  })

  window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase()
    if (container.current) {
      if (key === 'w' || key === 'arrowup') {
        clearInterval(movementIntervals.moveUp)
        delete movementIntervals.moveUp
      } else if (key === 'a' || key === 'arrowleft') {
        clearInterval(movementIntervals.moveLeft)
        delete movementIntervals.moveLeft
      } else if (key === 's' || key === 'arrowdown') {
        clearInterval(movementIntervals.moveDown)
        delete movementIntervals.moveDown
      } else if (key === 'd' || key === 'arrowright') {
        clearInterval(movementIntervals.moveRight)
        delete movementIntervals.moveRight
      }
    }
  })
}

export default setup