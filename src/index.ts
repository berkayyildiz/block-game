import { Actor, CollisionType, Color, Engine, Input, Physics, Vector } from "excalibur"

let draggingActor: Actor | null

const game = new Engine({
  width: window.innerWidth,
  height: window.innerHeight,
})

// Start the engine to begin the game.
game.start()

let isPlaying = false

const boxes: Actor[] = []

function addBox() {
  const box = new Actor({
    x: game.drawWidth / 2 - 50,
    y: game.drawHeight / 2 - 20,
    width: 100,
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
  actor = new Actor({
    x: actorCenter.x,
    y: actorCenter.y,
    width: 40,
    height: 40,
    color: Color.Yellow,
  })
  actor.body.collisionType = CollisionType.Active
  actor.enableCapturePointer = true

  actor.on("pointerdown", () => {
    draggingActor = actor
  })

  actor.on("pointerup", () => {
    draggingActor = null
  })

  game.add(actor)
}

addActor()

function startPlay() {
  Physics.acc.setTo(0, 1000)
  isPlaying = true
}

function stopPlay() {
  Physics.acc.setTo(0, 0)
  actor.vel.setTo(0, 0)
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

let isActorJumping = false

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
  } else if (event.key == Input.Keys.W && !isActorJumping && isPlaying) {
    isActorJumping = true
    actor.vel.setTo(0, -400)
  }
})

actor.on("collisionend", event => {
  console.log(event)
  isActorJumping = false
})

actor.on("collisionstart", event => {
  console.log(event)
  isActorJumping = false
})

game.input.keyboard.on("hold", event => {
  const velX = 2.5
  if (isPlaying) {
    if (event.key == Input.Keys.D) {
      actor.pos.x += velX
    } else if (event.key == Input.Keys.A) {
      actor.pos.x -= velX
    }
  }
})
