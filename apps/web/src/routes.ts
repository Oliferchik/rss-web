export enum ScopeType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum LayoutType {
  MAIN = 'MAIN',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export enum RoutePath {
  // Private paths
  Home = '/',
  // Auth paths
  SignIn = '/sign-in',

  NotFound = '/404',
}

type RoutesConfiguration = {
  [routePath in RoutePath]: {
    scope?: ScopeType;
    layout?: LayoutType;
  };
};

export const routesConfiguration: RoutesConfiguration = {
  // Private routes
  [RoutePath.Home]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },

  // Auth routes
  [RoutePath.SignIn]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },

  [RoutePath.NotFound]: {},
};
