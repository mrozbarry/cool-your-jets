import Base from './Base';
import p2 from 'p2';
import * as collisions from '#/collisions';
import { properties, circleStroke } from '#/lib/canvas';

export default class FreeGamemode extends Base {
  renderCollection(collection) {
    return collection;
  }
}
