import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserState {
  avatarPreview: string | null;
  handleGetProfile: () => Promise<void>;
  handleGetStoreProfile: () => Promise<void>;
}

export const useUsers = create<UserState>()((set) => ({
  avatarPreview: null,
  handleGetProfile: async () => {
    try {
      const token = usePersistedUser.getState().token;
      if (!token) {
        console.error("Anda belum login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `application/json`,
          },
        }
      );

      const responseJson = await response.json();
      if (responseJson.success === true) {
        set({
          avatarPreview: responseJson.data.profile.avatar_link,
        });
        usePersistedUser.getState().setName(responseJson.data.profile.name);
      } else {
        console.error(responseJson.message);
        localStorage.clear();
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  },
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
      if (responseJson.success === true) {
        set({
          avatarPreview: responseJson.data.avatar_link,
        });
        usePersistedUser.getState().setName(responseJson.data.name);
      } else {
        console.log(responseJson.message);
        // localStorage.clear();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  },
}));

interface PersistedUser {
  name: string;
  setName: (name: string) => void;
  token: string;
  setToken: (token: string) => void;
  is_login: boolean;
  setIsLogin: (is_login: boolean) => void;
  is_store: boolean;
  setIsStore: (is_store: boolean) => void;
  exist_store: boolean;
  setExistStore: (exist_store: boolean) => void;
  logout: () => void;
}

export const usePersistedUser = create<PersistedUser>()(
  devtools(
    persist(
      (set) => ({
        name: "",
        setName: (name: string) => set({ name }),
        token: "",
        setToken: (token: string) => set({ token }),
        is_login: false,
        setIsLogin: (is_login: boolean) => set({ is_login }),
        is_store: false,
        setIsStore: (is_store: boolean) => set({ is_store }),
        exist_store: false,
        setExistStore: (exist_store: boolean) => set({ exist_store }),
        logout: () =>
          set(
            {
              name: "",
              token: "",
              is_login: false,
              is_store: false,
              exist_store: false,
            },
            false
          ),
      }),
      { name: "user-storage" }
    )
  )
);
