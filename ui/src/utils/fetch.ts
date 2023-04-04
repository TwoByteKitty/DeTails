import { TOKEN_KEY } from "@/stores/auth.store";
import { useCookies } from "vue3-cookies";

const REGISTER_URL = '/create';
const LOGIN_URL = '/login';

interface IFetchHeaders {
   'Content-Type'?: string | undefined;
   'x-access-token'?: string
}

interface IFetchOptions {
   method: 'GET' | 'PUT' | 'POST' | 'DELETE';
   headers: IFetchHeaders
   body?: {}
}

const doFetch = async (url: string, options: {}) => {
   const response = await fetch(API_URL(url), options);
   if (response.status !== 200) {
      const error = await response.json();
      throw new Error(`${error.type}:${error.message}`);
   }
   return response;
}

export const PET_API = 'api/pets';
export const USER_API = 'api/user';
export const API_URL = (path: string) => (`${API_HOST}/${path}`);

export const REGISTER = async (data: {}) => {

   const options: IFetchOptions = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
   }
   return await (await doFetch(`${USER_API}/${REGISTER_URL}`, options)).json();
}

export const LOGIN = async (data: {}) => {

   const options: IFetchOptions = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
   }
   return await doFetch(`${USER_API}/${LOGIN_URL}`, options);
}

export const GET = async (url: string) => {
   const options: IFetchOptions = {
      method: 'GET',
      headers: {
         'x-access-token': useCookies().cookies.get(TOKEN_KEY),
      },
   }
   return await (await doFetch(url, options)).json();
}

export const POST = async (url: string, data: {}) => {

   const options: IFetchOptions = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'x-access-token': useCookies().cookies.get(TOKEN_KEY),
      },
      body: JSON.stringify(data)
   }
   return await (await doFetch(url, options)).json();
}

export const POST_IMAGE = async (url: string, data: {}) => {
   const options: IFetchOptions = {
      method: 'POST',
      headers: {
         'x-access-token': useCookies().cookies.get(TOKEN_KEY)
      },
      body: data
   }
   return await (await doFetch(url, options)).json();
}

export const PUT = async (url: string, data: {}) => {
   const options: IFetchOptions = {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json',
         'x-access-token': useCookies().cookies.get(TOKEN_KEY),
      },
      body: JSON.stringify(data)
   }
   return await (await doFetch(url, options)).json();
}

export const DELETE = async (url: string, data: {}) => {
   const options: IFetchOptions = {
      method: 'DELETE',
      headers: {
         'Content-Type': 'application/json',
         'x-access-token': useCookies().cookies.get(TOKEN_KEY),
      },
      body: JSON.stringify(data)
   }
   return await (await doFetch(url, options)).json();
}

