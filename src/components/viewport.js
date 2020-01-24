import { translate, clip, scale } from '#/lib/canvas';

export default ({ offset, pixelSize, virtualSize }, children) => {
  const path = new Path2D();
  path.rect(0, 0, pixelSize[0], pixelSize[1]);

  const scaling = virtualSize.map((v, i) => pixelSize[i] / v);

  return translate(offset, [
    clip(path, scale(scaling, children)),
  ]);
};
