const API_HOST = ()=>(location.hostname === 'localhost' ? '': 'https://jellyfish-app-yclr8.ondigitalocean.app');
export const PET_API = 'api/pets'
export const USER_API = 'api/user'
export const API_URL = (path: string) => (`${API_HOST()}/${path}`);

interface IFetchHeaders{
   'Content-Type'?: string|undefined;
   'x-access-token'?: string
}

interface IFetchOptions{
   method: 'GET'|'PUT'|'POST';
   headers: IFetchHeaders
   body?: {}
}

const OPTIONS: IFetchOptions = {
   method: 'GET',
   headers: {
      'Content-Type': undefined,
      'x-access-token': undefined
   },
}
const doFetch = async (url: string, options: {})=>{
      return await (await fetch(API_URL(url), options)).json();
}

export const GET = async (url:string, token?: string)=>{
   if(token){
      OPTIONS.headers['x-access-token'] = token;
   }
   OPTIONS.body = undefined;
   OPTIONS.method = 'GET'
   return await doFetch(url, OPTIONS)
}

export const POST = async (url:string, data: {}, token?: string, isJSON: boolean = true)=>{
   if(token){
      OPTIONS.headers['x-access-token'] = token;
   }
   OPTIONS.method = 'POST'
   OPTIONS.headers['Content-Type'] = isJSON ? 'application/json': undefined;
   OPTIONS.body = isJSON ? JSON.stringify(data) : data;
   return await doFetch(url, OPTIONS)
}

export const PUT = async (url:string, data: {}, token: string)=>{
   OPTIONS.method = 'PUT'
   OPTIONS.headers['Content-Type'] = 'application/json';
   OPTIONS.headers['x-access-token'] = token;
   OPTIONS.body = JSON.stringify(data);
   return await doFetch(url, OPTIONS)
}
