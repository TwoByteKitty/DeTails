import router from '@/router';
import { LOGIN } from '@/utils/fetch';
import { defineStore } from 'pinia';
import { useCookies } from "vue3-cookies";

const LOGIN_URL = 'api/user/login';
export const TOKEN_KEY = 'x-access-token';
export const USER_KEY = 'x-user-name';

export const useAuthStore = defineStore({
   id: 'auth',
   state: () => ({
     user: '',
     returnUrl: ''
   }),
   actions: {
    async login({userName, password}:{userName: string, password: string}) {
      const { cookies } = useCookies();
      try{
         const response = await LOGIN(LOGIN_URL, { userName, password });
         const { user }: { user: string } = await response.json();
         this.user = user;

         const token = response.headers.get(TOKEN_KEY);

         if(token){
            cookies
               .set(TOKEN_KEY, token, '2h')
               .set(USER_KEY, user, '2h');
            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/my-pets');
         }
      } catch (error:any) {
        throw new Error(error.message);
      }
    },
    logout() {
      const { cookies } = useCookies();
      this.user = null;
      cookies.remove(TOKEN_KEY);
      cookies.remove(USER_KEY);
      router.push('/login');
    }
   }
});
