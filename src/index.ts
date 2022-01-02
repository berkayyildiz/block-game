import { Actor, CollisionType, Color, Engine, vec } from "excalibur";

let draggingActor: Actor;

const game = new Engine({
  width: 800,
  height: 600,
});

// Start the engine to begin the game.
game.start();

const paddle = new Actor({
  x: 150,
  y: game.drawHeight - 40,
  width: 100,
  height: 40,
  color: Color.Gray,
});

paddle.body.collisionType = CollisionType.Fixed;

game.add(paddle);

paddle.enableCapturePointer = true;

paddle.on("pointerdown", (event) => {
  draggingActor = paddle;
});

paddle.on("pointerup", (event) => {
  draggingActor = null;
});

game.input.pointers.primary.on("move", (event) => {
  if (draggingActor) {
    draggingActor.pos.x = event.pointer.lastWorldPos.x;
    draggingActor.pos.y = event.pointer.lastWorldPos.y;
  }
});
