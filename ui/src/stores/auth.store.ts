import router from '@/router';
import { defineStore } from 'pinia';

const LOGIN_URL = '/api/user/login';

export const useAuthStore = defineStore({
   id: 'auth',
   state: () => ({
       // initialize state from local storage to enable user to stay logged in
       user: JSON.parse(localStorage.getItem('user') as string),
       returnUrl: ''
   }),
   actions: {
       async login({userName, password}:{userName: string, password: string}) {
         const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({userName, password}),
          };

           const user = await(await fetch(LOGIN_URL, requestOptions)).json();
           // update pinia state
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
