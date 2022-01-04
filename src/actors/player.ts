import { Actor, CollisionType, Color, Engine, Input, Vector } from "excalibur"
import { User } from "firebase/auth"
import { child, Database, get, ref, set } from "firebase/database"

export class Player extends Actor {
  velocity: Vector

  constructor(private user: User, private database: Database) {
    super({ x: 0, y: 0, width: 40, height: 40, color: Color.Yellow })
    this.body.collisionType = CollisionType.Active
    this.enableCapturePointer = true

    get(child(ref(database), `players/${this.user.uid}`))
      .then(snapshot => {
        if (snapshot.exists()) {
          this.pos.x = (<{ x: number; y: number }>snapshot.val()).x
          this.pos.y = (<{ x: number; y: number }>snapshot.val()).y
        } else {
          console.log("No data available")
        }
      })
      .catch(error => {
        console.error(error)
      })
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
      set(ref(this.database, `players/${this.user.uid}`), {
        x: this.pos.x,
        y: this.pos.y,
      })
    }
  }
}
