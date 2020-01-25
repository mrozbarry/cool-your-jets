import { translate, clip, scale, restorable } from '#/lib/canvas';

export default ({ offset, pixelSize, virtualSize, path }, children) => {
  const scaling = virtualSize.map((v, i) => pixelSize[i] / v);

  return restorable(translate(offset, [
    clip(path, scale(scaling, children)),
  ]));
};
