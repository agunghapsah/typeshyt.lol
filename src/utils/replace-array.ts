export const replaceArray = <Type>(array: Type[], items: Type[]) => {
  array.splice(0, array.length, ...items);
};
