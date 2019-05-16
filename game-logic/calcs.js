let getDistance = (origin, dest) => {
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
//__________________________________________________________________
let isInRange = (range, origin, dest) => {
  let distance = getDistance(origin, dest);
  if (distance <= range) {
    return true;
  }
  return false;
};
//__________________________________________________________________
/////////////////////////////////////////////////////////////////////
//__________________________________________________________________
lineRange = (range, origin, dest) => {
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
//_________________________________________________________________
lineTarget = (range, origin, dest) => {
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
//__________________________________________________________________
lineMove = (range, origin, dest) => {
  let check = false;
  if (
    Math.abs(origin.y - dest.y) > range ||
    Math.abs(origin.x - dest.x) > range
  ) {
    check = false;
  }
  if (origin.x === dest.x) {
    check = true;
  }
  if (origin.y === dest.y) {
    check = true;
  }
  if (Math.abs(origin.y - dest.y) === Math.abs(origin.x - dest.x)) {
    check = true;
  }
  if (!check) {
    return { x: 0, y: 0 };
  }
  //____________________
  if (origin.y < dest.y) {
    if (origin.x === dest.x) {
      return { x: 0, y: 1 };
    }
    if (origin.x > dest.x) {
      return { x: 1, y: 1 };
    }
    if (origin.x < dest.x) {
      return { x: -1, y: 1 };
    }
  }
  //____________________
  if (origin.y === dest.y) {
    if (origin.x > dest.x) {
      return { x: 1, y: 0 };
    }
    if (origin.x < dest.x) {
      return { x: 1, y: 0 };
    }
  }
  //____________________
  if (origin.y > dest.y) {
    if (origin.x === dest.x) {
      return { x: 0, y: -1 };
    }
    if (origin.x > dest.x) {
      return { x: 1, y: -1 };
    }
    if (origin.x < dest.x) {
      return { x: -1, y: -1 };
    }
  }
  return { x: 0, y: 0 };
};
//__________________________________________________________________
module.exports = {
  getDistance,
  isInRange,
  lineRange,
  lineMove,
  lineTarget
};
