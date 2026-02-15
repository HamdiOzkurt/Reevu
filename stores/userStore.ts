import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  avatarUri: string | null;
  setProfile: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  setAvatar: (uri: string | null) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      firstName: "",
      lastName: "",
      email: "",
      avatarUri: null,

      setProfile: (data) => set(data),
      setAvatar: (uri) => set({ avatarUri: uri }),
      clearProfile: () =>
        set({ firstName: "", lastName: "", email: "", avatarUri: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
