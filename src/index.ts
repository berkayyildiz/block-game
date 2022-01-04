import { Actor, CollisionType, Color, Engine, Input, Vector } from "excalibur"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { Player } from "./actors/player"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBURJTpthV-bxkyYuMDBpTYuZ2z2dy3XV0",
  authDomain: "game-of-blocks.firebaseapp.com",
  databaseURL: "https://game-of-blocks-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "game-of-blocks",
  storageBucket: "game-of-blocks.appspot.com",
  messagingSenderId: "529244131206",
  appId: "1:529244131206:web:f9167a6b558ddd0e72e607",
  measurementId: "G-Q92ZFW5PDN",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
import { getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth"
let user: User
const auth = getAuth()
function login() {
  console.log("hey")

  signInWithEmailAndPassword(auth, "test@mail.com", "123456789")
    .then(userCredential => {
      // Signed in
      user = userCredential.user
      console.log(user)
      addActor()

      // ...
    })
    .catch(error => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorMessage, errorCode)
    })
}

function logout() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("sign out succesfull")
      actor.kill()
      user = null
    })
    .catch(error => {
      // An error happened.
      console.log("sign out error")
    })
}
let draggingActor: Actor | null

const game = new Engine({
  width: window.innerWidth * 0.9,
  height: window.innerHeight * 0.9,
})

// Start the engine to begin the game.
game.start()

let isPlaying = false

const boxes: Actor[] = []

function addBox() {
  const box = new Actor({
    x: game.drawWidth / 2 - 20,
    y: game.drawHeight / 2 - 20,
    width: 40,
    height: 40,
    color: Color.Gray,
  })
  box.body.collisionType = CollisionType.Fixed
  box.enableCapturePointer = true

  box.on("pointerdown", () => {
    draggingActor = box
  })

  box.on("pointerup", () => {
    draggingActor = null
  })
  boxes.push(box)
  game.add(box)
}

let actor: Actor

const actorCenter = new Vector(game.drawWidth / 2 - 20, game.drawHeight / 2 - 20)

function addActor() {
  actor = new Player(user, database)

  actor.on("pointerdown", () => {
    draggingActor = actor
  })

  actor.on("pointerup", () => {
    draggingActor = null
  })
  game.add(actor)
}

function startPlay() {
  isPlaying = true
  game.currentScene.camera.strategy.lockToActor(actor)
}

function stopPlay() {
  isPlaying = false
}

let lastPointerPos: Vector

game.input.pointers.primary.on("down", () => {
  lastPointerPos = game.input.pointers.primary.lastWorldPos
})

game.input.pointers.primary.on("move", event => {
  if (event.pointer.isDragging) {
    if (draggingActor) {
      draggingActor.pos.x = event.pointer.lastWorldPos.x
      draggingActor.pos.y = event.pointer.lastWorldPos.y
    } else {
      const xShift = game.input.pointers.primary.lastWorldPos.x - lastPointerPos.x
      const yShift = game.input.pointers.primary.lastWorldPos.y - lastPointerPos.y

      const factor = -0.75 //Higher factors create wiggle on actors
      game.currentScene.camera.x += xShift * factor
      game.currentScene.camera.y += yShift * factor

      lastPointerPos = game.input.pointers.primary.lastWorldPos
    }
  }
})

game.input.pointers.primary.on("wheel", event => {
  const factor = 0.001
  game.currentScene.camera.zoom -= event.deltaY * factor
})

game.input.keyboard.on("press", event => {
  if (event.key == Input.Keys.B) {
    addBox()
  } else if (event.key == Input.Keys.P) {
    if (isPlaying) {
      stopPlay()
    } else {
      startPlay()
    }
  } else if (event.key == Input.Keys.R) {
    actor.pos.setTo(actorCenter.x, actorCenter.y)
  } else if (event.key == Input.Keys.L) {
    login()
  } else if (event.key == Input.Keys.O) {
    logout()
  }
})
