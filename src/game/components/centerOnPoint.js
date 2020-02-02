import { translate, restorable } from '#/lib/canvas';

export default ({ focus, screen }, children) => {
  const centerOnShip = [
    (screen.width / 2) - focus[0],
    (screen.height / 2) - focus[1],
  ];

  return restorable(
    translate(centerOnShip, [
      children,
    ]),
  );
};


