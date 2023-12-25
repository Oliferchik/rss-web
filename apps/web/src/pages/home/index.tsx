import Head from 'next/head';
import { NextPage } from 'next';
import {
  Stack,
} from '@mantine/core';

import { ChannelList, ChannelInput, RssUrl } from 'components';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Home</title>
    </Head>
    <Stack gap="lg">
      <RssUrl />
      <ChannelInput />
      <ChannelList />
    </Stack>
  </>
);

export default Home;
