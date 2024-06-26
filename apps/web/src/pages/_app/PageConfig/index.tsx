import { FC, Fragment, ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { routesConfiguration, ScopeType, LayoutType, RoutePath } from 'routes';
import { tokenUtil } from 'utils';

import MainLayout from './MainLayout';
import UnauthorizedLayout from './UnauthorizedLayout';
import PrivateScope from './PrivateScope';

const layoutToComponent = {
  [LayoutType.MAIN]: MainLayout,
  [LayoutType.UNAUTHORIZED]: UnauthorizedLayout,
};

const scopeToComponent = {
  [ScopeType.PUBLIC]: Fragment,
  [ScopeType.PRIVATE]: PrivateScope,
};

interface PageConfigProps {
  children: ReactElement;
}

const PageConfig: FC<PageConfigProps> = ({ children }) => {
  const { route, push, query } = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) {
    return null;
  }

  const token = tokenUtil.getToken();

  const { scope, layout } = routesConfiguration[route as RoutePath] || {};
  const Scope = scope ? scopeToComponent[scope] : Fragment;
  const Layout = layout ? layoutToComponent[layout] : Fragment;

  if (scope === ScopeType.PRIVATE && !token) {
    if (query.token) {
      tokenUtil.setToken(query.token as string);
    }

    const path = query.token ? RoutePath.Home : RoutePath.SignIn;
    push(path);

    return null;
  }

  if (scope === ScopeType.PUBLIC && token) {
    push(RoutePath.Home);

    return null;
  }

  return (
    <Scope>
      <Layout>
        {children}
      </Layout>
    </Scope>
  );
};

export default PageConfig;
