export const getDistance = (origin, dest) => {
  let width = origin.x - dest.x;
  let length = origin.y - dest.y;
  if (length < 0) {
    length = length * -1;
  }
  if (width < 0) {
    width = width * -1;
  }
  width = width * width;
  length = length * length;

  let distance = width + length;
  distance = Math.round(Math.sqrt(distance));
  return distance;
};

export const isInRange = (range, origin, dest) => {
  let distance = getDistance(origin, dest);
  if (distance <= range) {
    return true;
  }
  return false;
};

export const lineRange = (range, origin, dest) => {
  if (
    Math.abs(origin.y - dest.y) > range ||
    Math.abs(origin.x - dest.x) > range
  ) {
    return false;
  }
  if (origin.x === dest.x) {
    return true;
  }
  if (origin.y === dest.y) {
    return true;
  }
  if (Math.abs(origin.y - dest.y) === Math.abs(origin.x - dest.x)) {
    return true;
  }
  return false;
};

export const lineTarget = (range, origin, dest) => {
  if (
    Math.abs(origin.y - dest.y) > range ||
    Math.abs(origin.x - dest.x) > range
  ) {
    return false;
  }
  if (origin.x === dest.x) {
    if (Math.abs(origin.y - dest.y) === range) {
      return true;
    }
  }
  if (origin.y === dest.y) {
    if (Math.abs(origin.x - dest.x) === range) {
      return true;
    }
  }
  if (Math.abs(origin.y - dest.y) === Math.abs(origin.x - dest.x)) {
    if (
      Math.abs(origin.y - dest.y) === range &&
      Math.abs(origin.x - dest.x) === range
    ) {
      return true;
    }
  }
  return false;
};
