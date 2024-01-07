import { FC } from 'react';

import { Table, Loader, Container, Button } from '@mantine/core';

import { channelsApi } from 'resources/channels';

import CopyButton from '../CopyButton';

type RssType = {
  channelId: string,
  lastMessage: string,
  url: string
};
const ChannelList: FC = () => {
  const { data: { body: rssFeeds } = {}, isLoading } = channelsApi.useRssGet();
  const { mutate: syncChannel } = channelsApi.useSync();

  if (isLoading && !rssFeeds) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  const rows = rssFeeds?.map((info: RssType) => (
    <Table.Tr key={info.channelId}>
      <Table.Td align="center">{info.channelId}</Table.Td>
      <Table.Td align="center">{info.lastMessage}</Table.Td>
      <Table.Td align="center">
        <CopyButton url={info.url} />
      </Table.Td>
      <Table.Td align="center">
        <Button
          variant="filled"
          size="xs"
          disabled={isLoading}
          onClick={() => syncChannel(info.channelId)}
        >
          Sync
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container>
      <Table striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th align="center">Channel Id</Table.Th>
            <Table.Th align="center">Last message</Table.Th>
            <Table.Th align="center">Rss feed</Table.Th>
            <Table.Th align="center">Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
};

export default ChannelList;
