const SHIP = Math.pow(2, 0);
const THRUST = Math.pow(2, 1);
const LASER = Math.pow(2, 2);
const LEVEL_SENSOR = Math.pow(2, 3);

export const particle = () => ({
  collisionGroup: THRUST,
  collisionMask: LASER | SHIP,
});

export const laser = () => ({
  collisionGroup: LASER,
  collisionMask: LASER | SHIP | THRUST,
});

export const ship = () => ({
  collisionGroup: SHIP,
  collisionMask: SHIP | LASER | LEVEL_SENSOR | THRUST,
});

export const levelSensor = () => ({
  collisionGroup: LEVEL_SENSOR,
  collisionMask: SHIP,
});
