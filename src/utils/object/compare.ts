export const compare = (
  obj1: Record<PropertyKey, any>,
  obj2: Record<PropertyKey, any>,
) => {
  for (const p in obj1) {
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    switch (typeof obj1[p]) {
      // Deep compare objects
      case 'object':
        if (!compare(obj1[p], obj2[p])) return false;
        break;
      // Compare function code
      case 'function':
        if (
          typeof obj2[p] == 'undefined' ||
          (p != 'compare' && obj1[p].toString() != obj2[p].toString())
        )
          return false;
        break;
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }

  for (const p in obj2) {
    if (typeof obj1[p] == 'undefined') return false;
  }

  return true;
};
