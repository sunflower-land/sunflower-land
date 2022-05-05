import { detectMobile } from "./hooks/useIsMobile";

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
  private movements: Vector[] = [];
  private tracks = 0;

  private track(event: MouseEvent) {
    if (detectMobile()) {
      return true;
    }

    this.movements.push({
      x: event.clientX,
      y: event.clientY,
    });
  }

  public calculate(): boolean {
    try {
      if (detectMobile() || process.env.NODE_ENV === "test") {
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
            vector
          );
          return distance === 0;
        });
      };

      const isCollinear = areCollinear(points);

      console.log({ points });
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
      console.log({ e });
      return true;
    }
  }

  public start() {
    this.movements = [];
    document.addEventListener("mousemove", this.track.bind(this));
  }

  public pause() {
    document.removeEventListener("mousemove", this.track);
  }
}

export const screenTracker = new ScreenTracker();
