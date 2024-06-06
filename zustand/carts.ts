import { create } from "zustand";

interface CartState {
  counter: number,
  increase: () => void,
  decrease: () => void,
}

export const useCart = create<CartState>()((set) => ({
  counter: 0,
  increase: () => set((state) => ({counter: state.counter + 1})),
  decrease: () => set((state) => ({counter: state.counter - 1})),
}))