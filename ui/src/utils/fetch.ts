const API_HOST = ()=>((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? '': 'https://jellyfish-app-yclr8.ondigitalocean.app');
export const PET_API = 'api/pets'
export const USER_API = 'api/user'
export const API_URL = (path: string) => (`${API_HOST()}/${path}`);

interface IFetchHeaders{
   'Content-Type'?: string|undefined;
   'x-access-token'?: string
}

interface IFetchOptions{
   method: 'GET'|'PUT'|'POST'|'DELETE';
   headers: IFetchHeaders
   body?: {}
}

const doFetch = async (url: string, options: {})=>{
   const response = await fetch(API_URL(url), options);
   if(response.status !== 200){
      const error = await response.json();
      throw new Error(`${error.type}:${error.message}`);
   }
   return await response.json();
}

export const GET = async (url:string, token?: string)=>{
   const options: IFetchOptions = {
      method: 'GET',
      headers:{}
   }
   if(token){
      options.headers['x-access-token'] = token;
   }
   return await doFetch(url, options)
}

export const POST = async (url:string, data: {}, token?: string)=>{

   const options: IFetchOptions ={
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
   }
   if(token){
      options.headers['x-access-token'] = token;
   }
   return await doFetch(url, options)
}

export const POST_IMAGE = async (url:string, data: {}, token: string)=>{
   const options: IFetchOptions ={
      method: 'POST',
      headers: {
         'x-access-token': token
      },
      body: data
   }
   return await doFetch(url, options)
}

export const PUT = async (url:string, data: {}, token: string)=>{
   const options: IFetchOptions ={
      method: 'PUT',
      headers: {
         'x-access-token': token,
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
   }
   return await doFetch(url, options)
}

export const DELETE = async (url:string, data: {}, token: string)=>{
   const options: IFetchOptions ={
      method: 'DELETE',
      headers: {
         'x-access-token': token,
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
   }
   return await doFetch(url, options)
}

