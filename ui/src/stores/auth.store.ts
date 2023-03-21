import router from '@/router';
import { POST } from '@/utils/fetch';
import { defineStore } from 'pinia';

const LOGIN_URL = 'api/user/login';

export const useAuthStore = defineStore({
   id: 'auth',
   state: () => ({
       // initialize state from local storage to enable user to stay logged in
       user: JSON.parse(localStorage.getItem('user') as string),
       //TODO Setup return url login
       returnUrl: ''
   }),
   actions: {
       async login({userName, password}:{userName: string, password: string}) {

           const user = await POST(LOGIN_URL, {userName, password});

           this.user = user;

           // store user details and jwt in local storage to keep user logged in between page refreshes
           localStorage.setItem('user', JSON.stringify(user));

           // redirect to previous url or default to home page
           router.push(this.returnUrl || '/');
       },
       logout() {
           this.user = null;
           localStorage.removeItem('user');
           router.push('/login');
       }
   }
});
