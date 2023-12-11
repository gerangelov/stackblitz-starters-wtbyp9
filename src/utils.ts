export const delayFor = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
