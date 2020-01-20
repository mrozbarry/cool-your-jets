import p2 from 'p2';
import * as physicsGroups from '#/groups';

const magnitude = (a, b = [0, 0]) => {
  const deltaX = b[0] - a[0];
  const deltaY = b[1] - a[1];
  return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
};

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

const initialState = {
  shields: 1.0,
  fireLock: 0,
  power: 'ssslllttt',
  name: 'Unnamed',
};

const HEAD = 0;
const TAIL = 4;
const THRUSTERS = [1, 2];
const FINS = [2, 5];

const TO_DEGREES = 180 / Math.PI;
const TO_RADIANS = 180 * Math.PI;

const angleBetween = (b, a = [0, 0]) => (
  Math.atan2(b[1] - a[1], b[0] - a[0]) * TO_DEGREES
);

export const make = (name, [x, y]) => {
  const body = new p2.Body({
    mass: 10,
    position: [x, y],
  });

  const hull = new p2.Convex({
    vertices: points,
    collisionGroup: physicsGroups.SHIP,
    collisionMask: physicsGroups.SHIP | physicsGroups.LASER,
  });

  body.addShape(hull);

  return ({
    ...initialState,
    name: name || initialState.name,
    body,
    shapes: {
      hull,
    },
  });
};

export const position = ([x, y], ship) => {
  ship.body.position[0] = x;
  ship.body.position[1] = y;
  ship.body.previousPosition[0] = x;
  ship.body.previousPosition[1] = y;
  return ship;
};

export const distributePower = (power, ship) => ({
  ...ship,
  power,
});

export const shields = (amount, ship) => ({
  ...ship,
  shields: amount,
});

export const rotateBy = (amount, ship) => ({
  ...ship,
  points: ship.points.map((p) => {
    const m = magnitude(p);
    const a = angleBetween(p);
    const radians = (a + amount) / 180 * TO_RADIANS;

    return [
      Math.cos(radians) * m,
      Math.sin(radians) * m,
    ];
  }),
});

export const getAngle = (ship) => angleBetween(ship.points[HEAD], ship.points[TAIL]);
export const getThrusters = (ship) => THRUSTERS.map(idx => ship.points[idx]);
export const getFins = (ship) => FINS.map(idx => ship.points[idx]);
