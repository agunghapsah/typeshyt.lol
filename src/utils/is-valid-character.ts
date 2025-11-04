// Consider using regex
const VALID_CHARACTER: Record<string, true | undefined> = {
  a: true,
  b: true,
  c: true,
  d: true,
  e: true,
  f: true,
  g: true,
  h: true,
  i: true,
  j: true,
  k: true,
  l: true,
  m: true,
  n: true,
  o: true,
  p: true,
  q: true,
  r: true,
  s: true,
  t: true,
  u: true,
  v: true,
  w: true,
  x: true,
  y: true,
  z: true,
  '-': true,
  "'": true,
  '(': true,
  ')': true,
  ' ': true,
};

export const isValidCharacter = (letter: string): boolean => {
  const isValid = Boolean(VALID_CHARACTER[letter]);
  console.log(`"${letter}" is ${isValid}`);
  return isValid;
};
