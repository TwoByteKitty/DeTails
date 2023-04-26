export interface IRoute {
   path: string;
   name: string;
   pageTitle: string,
   component: any;
   meta: {
      authRequired: boolean;
      showInMenu: boolean,
   },
}
