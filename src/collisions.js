const SHIP = Math.pow(2, 0);
const THRUST = Math.pow(2, 1);
const LASER = Math.pow(2, 2);

export const particle = () => ({
  collisionGroup: THRUST,
  collisionMask: LASER,
});

export const laser = () => ({
  collisionGroup: LASER,
  collisionMask: LASER | SHIP | THRUST,
});

export const ship = () => ({
  collisionGroup: SHIP,
  collisionMask: SHIP | LASER,
});
