import p2 from 'p2';
import * as collisions from '#/collisions';

const points = [
  [0, -20], // Head
  //[10, 5],
  //[18, 5], // Fin
  [12, 20], // Thruster
  //[0, 12], // Tail
  [-12, 20], // Thruster
  //[-18, 5], // Fin
  //[-10, 5],
];

const THRUSTERS = [1, 2];
const FINS = [2, 5];

export default class Ship {
  constructor(name, [x, y]) {
    this.name = name;

    this.body = new p2.Body({
      mass: 10,
      position: [x, y],
    });

    const hull = new p2.Convex({
      vertices: points,
      ...collisions.ship(),
    });

    this.body.addShape(hull);
    this.shapes = {
      hull,
    };

    this.fireLock = 0;

    this.alive = true;

    // deprecated
    this.shields = 1.0;
    this.power = 'ssslllttt';

  }

  position([x, y]) {
    this.body.position[0] = x;
    this.body.position[1] = y;
    this.body.previousPosition[0] = x;
    this.body.previousPosition[1] = y;
  }

  getThrusters() {
    return THRUSTERS.map(index => {
      const vec = [0, 0];
      this.body.toWorldFrame(vec, points[index]);
      return vec;
    });
  }

  getFins() {
    return FINS.map(index => {
      const vec = [0, 0];
      this.body.toWorldFrame(vec, points[index]);
      return vec;
    });
  }
}
