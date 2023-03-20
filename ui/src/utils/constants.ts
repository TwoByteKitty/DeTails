export const API_DOMAIN = 'https://jellyfish-app-yclr8.ondigitalocean.app';

export const getApiUrl = (path: string) => (`${API_DOMAIN}/${path}`);
