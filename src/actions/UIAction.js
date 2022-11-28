import { LOADING_INITIATED } from "./type";

export const startLoading = (state = false) => {
  return { type: LOADING_INITIATED, payload: state };
};
