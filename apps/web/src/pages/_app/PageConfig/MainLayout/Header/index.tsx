import { memo, FC } from 'react';
import { AppShellHeader as LayoutHeader, Container, Button } from '@mantine/core';

import { Link } from 'components';
import { RoutePath } from 'routes';

import { accountApi } from 'resources/account';

import { LogoImage } from 'public/images';

import classes from './index.module.css';

const Header: FC = () => (
  <LayoutHeader>
    <Container
      className={classes.header}
      mih={72}
      px={32}
      py={0}
      display="flex"
      fluid
    >
      <Link type="router" href={RoutePath.Home}>
        <LogoImage />
      </Link>

      <Button onClick={() => { accountApi.signOut(); }}>
        Log out
      </Button>
    </Container>
  </LayoutHeader>
);

export default memo(Header);
