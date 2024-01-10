import Head from 'next/head';
import { NextPage } from 'next';

import { Button, Stack } from '@mantine/core';

import { API_URL } from 'app-constants';

import { GoogleIcon } from 'public/icons';

const SignIn: NextPage = () => (
  <>
    <Head>
      <title>Sign in</title>
    </Head>
    <Stack w={408} gap={20}>
      <Stack gap={34}>
        <Button
          component="a"
          leftSection={<GoogleIcon />}
          href={`${API_URL}/users/auth-google`}
          variant="outline"
        >
          Continue with Google
        </Button>
      </Stack>
    </Stack>

  </>
);

export default SignIn;
