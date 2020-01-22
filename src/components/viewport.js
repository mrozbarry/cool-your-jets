import { translate, clip, scale } from '#/lib/canvas';

export default ({ offset, pixelSize, virtualSize }, children) => {
  const path = new Path2D();
  path.rect(offset[0], offset[1], pixelSize[0], pixelSize[1]);

  return clip(path, [
    translate(offset, [
      scale(pixelSize.map((p, i) => p / virtualSize[i]), [
        children,
      ]),
    ]),
  ]);
};
