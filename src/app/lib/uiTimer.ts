import { Dispatch, SetStateAction } from "react"; 

export const startUiTimer = (setStep: Dispatch<SetStateAction<number>>, maxStep: number, interval: number = 1000): NodeJS.Timeout => {
  return setInterval(() => {
    setStep((prev) => (prev < maxStep - 1 ? prev + 1 : prev));
  }, interval);
};

export const stopUiTimer = (timerId: NodeJS.Timeout | null): void => {
  if (timerId) {
    clearInterval(timerId);
  }
};
