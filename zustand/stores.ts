import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { usePersistedUser } from "./users";

interface StoreState {
  avatarPreview: string | null;
  handleGetStoreProfile: () => Promise<void>;
}

export const useStore = create<StoreState>()((set) => ({
  avatarPreview: null,
  handleGetStoreProfile: async () => {
    try {
      const token = usePersistedUser.getState().token;
      if (!token) {
        console.error("Anda belum login");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();
      // console.log(responseJson)
      if (responseJson.success === true) {
        set({ avatarPreview: responseJson.data.avatar_link });
        usePersistedStore.getState().setName(responseJson.data.name);
      } else {
        console.log(responseJson.message);
        // localStorage.clear();
      }
    } catch (error: any) {
      console.error(error.message);
    }
  },
}));

interface PersistedStore {
  name: string;
  setName: (name: string) => void;
}

export const usePersistedStore = create<PersistedStore>()(
  devtools(
    persist(
      (set) => ({
        name: "",
        setName: (name: string) => set({ name }),
      }),
      { name: "store-storage" }
    )
  )
);

interface Province {
  province_id: string;
  province: string;
}

interface City {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

interface StoreStateProp {
  nameStore: string;
  setNameStore: (nameStore: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  description: string;
  setDescription: (description: string) => void;
  address: string;
  setAddress: (address: string) => void;
  province: Province;
  setProvince: (province: Province) => void;
  city: City;
  setCity: (city: City) => void;
  city_id: string;
  setCityId: (city_id: string) => void;
}

export const useStoreState = create<StoreStateProp>()(
  // persist(
  (set) => ({
    nameStore: "",
    setNameStore: (nameStore: string) => set({ nameStore }),
    phone: "",
    setPhone: (phone: string) => set({ phone }),
    description: "",
    setDescription: (description: string) => set({ description }),
    address: "",
    setAddress: (address: string) => set({ address }),
    province: {
      province_id: "",
      province: "",
    },
    setProvince: (province: Province) => set({ province }),
    city: {
      city_id: "",
      province_id: "",
      province: "",
      type: "",
      city_name: "",
      postal_code: "",
    },
    setCity: (city: City) => set({ city }),
    city_id: "",
    setCityId: (city_id: string) => set({ city_id }),
  })
  // { name: 'form-storage' }
  // )
);
