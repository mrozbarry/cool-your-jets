import p2 from 'p2';
import * as physicsGroups from '#/groups';

export const make = (parentBody) => {
  const position = [0, 0];
  parentBody.toWorldFrame(position, [0, -25]);
  const body = new p2.Body({
    mass: 1,
    position,
    velocity: parentBody.velocity,
    angle: parentBody.angle,
  });

  const shape = new p2.Box({
    width: 10,
    height: 10,
    collisionGroup: physicsGroups.LASER,
    collisionMask: physicsGroups.LASER | physicsGroups.SHIP | physicsGroups.THRUST,
  });

  body.addShape(shape);

  return body;
};
