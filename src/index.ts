import { Actor, CollisionType, Color, Engine, Input, Vector } from "excalibur";

let draggingActor: Actor;

const game = new Engine({
  width: window.innerWidth,
  height: window.innerHeight,
});

// Start the engine to begin the game.
game.start();

const boxes: Actor[] = [];

function addBox() {
  const box = new Actor({
    x: game.drawWidth / 2 - 50,
    y: game.drawHeight / 2 - 20,
    width: 100,
    height: 40,
    color: Color.Gray,
  });
  box.body.collisionType = CollisionType.Fixed;
  box.enableCapturePointer = true;

  box.on("pointerdown", (event) => {
    draggingActor = box;
  });

  box.on("pointerup", (event) => {
    draggingActor = null;
  });
  boxes.push(box);
  game.add(box);
}

let lastPointerPos: Vector;

game.input.pointers.primary.on("down", (event) => {
  lastPointerPos = game.input.pointers.primary.lastWorldPos;
});

game.input.pointers.primary.on("move", (event) => {
  if (event.pointer.isDragging) {
    if (draggingActor) {
      draggingActor.pos.x = event.pointer.lastWorldPos.x;
      draggingActor.pos.y = event.pointer.lastWorldPos.y;
    } else {
      const xShift =
        game.input.pointers.primary.lastWorldPos.x - lastPointerPos.x;
      const yShift =
        game.input.pointers.primary.lastWorldPos.y - lastPointerPos.y;

      const factor = -0.75; //Higher factors create wiggle on actors
      game.currentScene.camera.x += xShift * factor;
      game.currentScene.camera.y += yShift * factor;

      lastPointerPos = game.input.pointers.primary.lastWorldPos;
    }
  }
});

game.input.pointers.primary.on("wheel", (event) => {
  const factor = 0.001;
  game.currentScene.camera.zoom -= event.deltaY * factor;
});

game.input.keyboard.on("press", (event) => {
  if (event.key == Input.Keys.B) {
    addBox();
  }
});
