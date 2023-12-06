import { useCallback, useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Select,
  TextInput,
  Group,
  Title,
  Stack,
  Skeleton,
  Text,
  Container,
  UnstyledButton,
  Flex,
} from '@mantine/core';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { IconSearch, IconX, IconSelector } from '@tabler/icons-react';
import { RowSelectionState, SortingState } from '@tanstack/react-table';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';

import { userApi } from 'resources/user';

import { Table } from 'components';

import { PER_PAGE, columns, selectOptions } from './constants';

import classes from './index.module.css';

interface UsersListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: 'asc' | 'desc';
  };
  filter?: {
    createdOn?: {
      sinceDate: Date | null;
      dueDate: Date | null;
    };
  };
}

const Home: NextPage = () => (
  <>
    <Head>
      <title>Home</title>
    </Head>
    <Stack gap="lg" />
  </>
);

export default Home;
