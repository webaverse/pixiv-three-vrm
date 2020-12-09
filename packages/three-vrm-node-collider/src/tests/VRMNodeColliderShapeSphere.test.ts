/* eslint-env jest */

import * as THREE from 'three';
import { VRMNodeColliderShapeSphere } from '../VRMNodeColliderShapeSphere';
import { toBeCloseToVector3 } from './matchers/toBeCloseToVector3';

beforeEach(() => {
  expect.extend({ toBeCloseToVector3 });
});

describe('VRMNodeColliderShapeSphere', () => {
  it('must be instantiated properly', () => {
    const shape = new VRMNodeColliderShapeSphere({
      radius: 1.0,
      offset: new THREE.Vector3(0.0, 0.0, 0.0),
    });
    expect(shape).toBeInstanceOf(VRMNodeColliderShapeSphere);
  });

  it('must fallback its offset to (0.0, 0.0, 0.0) if not specified', () => {
    const shape = new VRMNodeColliderShapeSphere();
    expect(shape.offset).toBeCloseToVector3(new THREE.Vector3(0.0, 0.0, 0.0));
  });

  describe('calculateCollision', () => {
    it('must calculate a collision properly', () => {
      const shape = new VRMNodeColliderShapeSphere({
        radius: 1.0,
      });

      const colliderMatrix = new THREE.Matrix4().makeTranslation(1.0, 0.0, 0.0);
      const objectPosition = new THREE.Vector3(2.0, 1.0, 0.0);
      const objectRadius = 1.0;

      const dir = new THREE.Vector3();
      const distSq = shape.calculateCollision(colliderMatrix, objectPosition, objectRadius, dir);

      expect(distSq).toBeCloseTo(-0.585786); // sqrt(2) - 2
      expect(dir).toBeCloseToVector3(new THREE.Vector3(1.0, 1.0, 0.0).normalize());
    });

    it('must calculate a collision properly, with an offset', () => {
      const shape = new VRMNodeColliderShapeSphere({
        radius: 1.0,
        offset: new THREE.Vector3(0.0, 0.0, -1.0),
      });

      const colliderMatrix = new THREE.Matrix4().makeTranslation(1.0, 0.0, 0.0);
      const objectPosition = new THREE.Vector3(2.0, 1.0, 0.0);
      const objectRadius = 1.0;

      const dir = new THREE.Vector3();
      const distSq = shape.calculateCollision(colliderMatrix, objectPosition, objectRadius, dir);

      expect(distSq).toBeCloseTo(-0.267949); // sqrt(3) - 2
      expect(dir).toBeCloseToVector3(new THREE.Vector3(1.0, 1.0, 1.0).normalize());
    });

    it('must calculate a collision properly, with an offset nad a rotation', () => {
      const shape = new VRMNodeColliderShapeSphere({
        radius: 1.0,
        offset: new THREE.Vector3(0.0, 1.0, 1.0),
      });

      const colliderMatrix = new THREE.Matrix4().makeRotationX(-0.5 * Math.PI);
      const objectPosition = new THREE.Vector3(-1.0, 1.0, -1.0);
      const objectRadius = 1.0;

      const dir = new THREE.Vector3();
      const distSq = shape.calculateCollision(colliderMatrix, objectPosition, objectRadius, dir);

      expect(distSq).toBeCloseTo(-1.0);
      expect(dir).toBeCloseToVector3(new THREE.Vector3(-1.0, 0.0, 0.0).normalize());
    });
  });
});
