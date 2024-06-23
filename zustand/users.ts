import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserState {
  isLogged: boolean,
  setLogged: () => void,
  role: string,
  setRole: (role: string) => void,
  avatarPreview: string | null,
  handleGetProfile: () => Promise<void>,
  handleGetStoreProfile: () => Promise<void>,
}

export const useUsers = create<UserState>()(
  (set) => ({
    avatarPreview: null,
    isLogged: false,
    setLogged: () => {
      const logged = localStorage.getItem('is_login')
      if(!logged || logged === 'false') return false
      set({ isLogged: true })
    },
    role: '',
    handleGetProfile: async () => {
      try {
        const token = localStorage.getItem('token');
  
        if (!token) {
          console.error('Anda belum login')
          return;
        }
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `application/json`
          }
        })
  
        const responseJson = await response.json();
        if (responseJson.success === true) {
          set({ 
            avatarPreview: responseJson.data.profile.avatar_link, 
            role: responseJson.data.user.role_id
          })
          usePersistedUser.getState().setName(responseJson.data.profile.name)
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
        const token = localStorage.getItem('token');
  
        if (!token) {
          console.error('Anda belum login')
          return;
        }
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        const responseJson = await response.json();
        console.log(responseJson)
        if (responseJson.success === true) {
          set({ 
            avatarPreview: responseJson.data.avatar_link

          })
          usePersistedUser.getState().setName(responseJson.data.name)
        } else {
          console.log(responseJson.message)
          localStorage.clear();
        }
  
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    setRole: (role: string) => set({ role: role }),
  }),
)

interface PersistedUser {
  name: string,
  setName: (name: string) => void,
}

export const usePersistedUser = create<PersistedUser>()(
  devtools(
    persist(
      (set) => ({
        name: '',
        setName: (name: string) => set({ name }),
      }),
      { name: 'user-storage' }
    )
  )
)