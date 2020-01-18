const magnitude = (a, b = [0, 0]) => {
  const deltaX = b[0] - a[0];
  const deltaY = b[1] - a[1];
  return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
};


const initialState = {
  points: [
    [0, -20], // Head
    [10, 5],
    [18, 5], // Fin
    [12, 20], // Thruster
    [0, 12], // Tail
    [-12, 20], // Thruster
    [-18, 5], // Fin
    [-10, 5],
  ],
  offset: [0, 0],
  power: ['s', 's', 'l', 'l', 't', 't'],
  name: 'Unnamed',
};

const HEAD = 0;
const TAIL = 4;
const THRUSTERS = [3, 5];
const FINS = [2, 6];

const TO_DEGREES = 180 / Math.PI;
const TO_RADIANS = 180 * Math.PI;

const angleBetween = (b, a = [0, 0]) => (
  Math.atan2(b[1] - a[1], b[0] - a[0]) * TO_DEGREES
);

export const identity = (name) => ({
  ...initialState,
  name: name || initialState.name,
});

export const position = ([x, y], ship) => ({
  ...ship,
  offset: [x, y],
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
