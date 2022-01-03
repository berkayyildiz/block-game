import { Actor, CollisionType, Color, Engine, Input, Vector } from "excalibur"

export class Player extends Actor {
  velocity: Vector

  constructor(x: number, y: number) {
    super({ x: x, y: y, width: 40, height: 40, color: Color.Yellow })
    this.body.collisionType = CollisionType.Active
    this.enableCapturePointer = true
  }

  public onInitialize(engine: Engine) {}

  public update(engine: Engine, delta: number) {
    super.update(engine, delta)
    let vel = new Vector(0, 0)

    if (engine.input.keyboard.isHeld(Input.Keys.W)) {
      vel = vel.add(new Vector(0, -1))
    }
    if (engine.input.keyboard.isHeld(Input.Keys.A)) {
      vel = vel.add(new Vector(-1, 0))
    }
    if (engine.input.keyboard.isHeld(Input.Keys.D)) {
      vel = vel.add(new Vector(1, 0))
    }
    if (engine.input.keyboard.isHeld(Input.Keys.S)) {
      vel = vel.add(new Vector(0, 1))
    }

    if (vel.size > 0) {
      vel = vel.normalize()
      vel = vel.scale(5)

      this.pos.x += vel.x
      this.pos.y += vel.y
    }
  }
}
