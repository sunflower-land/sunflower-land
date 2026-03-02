import { MachineInterpreter } from "features/auth/lib/authMachine";
import { isMobile } from "mobile-device-detect";

type Vector = {
  x: number;
  y: number;
};

// https://stackoverflow.com/questions/6865832/detecting-if-a-point-is-of-a-line-segment
function calcDistancePointToLine(line1: Vector, line2: Vector, pnt: Vector) {
  const L2 =
    (line2.x - line1.x) * (line2.x - line1.x) +
    (line2.y - line1.y) * (line2.y - line1.y);
  if (L2 == 0) return false;
  const s =
    ((line1.y - pnt.y) * (line2.x - line1.x) -
      (line1.x - pnt.x) * (line2.y - line1.y)) /
    L2;
  return Math.abs(s) * Math.sqrt(L2);
}

class ScreenTracker {
  private service?: MachineInterpreter;
  private movements: Vector[] = [];
  private tracks = 0;

  private track(event: MouseEvent) {
    if (isMobile) {
      return true;
    }

    this.movements.push({
      x: event.clientX,
      y: event.clientY,
    });
  }

  private clicks: number[] = [];

  private clicked() {
    this.clicks.push(Date.now());

    // Only store clicks in the last second
    this.clicks = this.clicks.filter((time) => time > Date.now() - 1000);

    // World Record is 16 clicks per second
    if (this.clicks.length > 15) {
      this.service?.send({ type: "REFRESH" });
    }
  }

  public calculate(): boolean {
    try {
      if (isMobile || process.env.NODE_ENV === "test") {
        return true;
      }

      let isValid = true;

      const step = Math.floor(this.movements.length / 10) || 1;
      // Pick random points along the line
      let points: Vector[] = [];
      for (let i = 0; i < this.movements.length; i += step) {
        points = [...points, this.movements[i]];
      }

      const areCollinear = (vectors: Vector[]) => {
        return vectors.every((vector) => {
          const distance = calcDistancePointToLine(
            vectors[0],
            vectors[vectors.length - 1],
            vector,
          );
          return distance === 0;
        });
      };

      const isCollinear = areCollinear(points);

      if (isCollinear) {
        this.tracks += 3;
      } else if (this.tracks > 0) {
        this.tracks = 0;
      }

      if (this.tracks > 10) {
        isValid = false;
      }

      this.movements = [];
      return isValid;
    } catch (e) {
      return true;
    }
  }

  // Workaround for storing function reference for event listeners
  private clicker: any;
  private tracker: any;

  public start(service: MachineInterpreter) {
    this.service = service;
    this.movements = [];

    this.tracker = this.track.bind(this);
    this.clicker = this.clicked.bind(this);

    document.addEventListener("mousemove", this.tracker, false);
    document.addEventListener("click", this.clicker, false);
  }

  public pause() {
    document.removeEventListener("mousemove", this.tracker, false);
    document.removeEventListener("click", this.clicker, false);
  }
}

export const screenTracker = new ScreenTracker();
