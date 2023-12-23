import Head from 'next/head';
import { NextPage } from 'next';
import {
  Stack,
} from '@mantine/core';

import { ChannelList, ChannelInput } from 'components';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Home</title>
    </Head>
    <Stack gap="lg">
      <ChannelInput />
      <ChannelList />
    </Stack>
  </>
);

export default Home;
