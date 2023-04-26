import router from '@/router';
import { LOGIN } from '@/utils/fetch';
import { defineStore } from 'pinia';
import { useCookies } from "vue3-cookies";

export const TOKEN_KEY = 'x-access-token';
export const USER_KEY = 'x-user-name';

interface IAuthState {
   user?: string | null;
   returnUrl?: string | null;
}

const getInitialUser = ():string| null => {
   const { cookies } = useCookies();
   return cookies.get(USER_KEY) || null;
}

const initialState: IAuthState = {
   user: getInitialUser(),
   returnUrl: null
}

export const useAuthStore = defineStore({
   id: 'auth',
   state: () => (initialState),
   actions: {
      async login({ userName, password }: { userName: string, password: string }) {
         const { cookies } = useCookies();
         try {
            const response = await LOGIN({ userName, password });
            const { user }: { user: string } = await response.json();
            const token = response.headers.get(TOKEN_KEY);

            if (token) {
               cookies
                  .set(TOKEN_KEY, token, '3h')
                  .set(USER_KEY, user, '3h');
                  this.user = user;
               router.push(this.returnUrl || '/my-pets');
            }
         } catch (error: any) {
            this.user = null;
            throw new Error(error.message);
         }
      },
      logout(sendToLogin: boolean = true) {
         const { cookies } = useCookies();
         this.user = null;
         cookies.remove(TOKEN_KEY);
         cookies.remove(USER_KEY);
         router.push(sendToLogin ? '/login' : '/');
      },
      setReturnURL(url: string|null) {
         this.returnUrl = url;
      }
   }
});
