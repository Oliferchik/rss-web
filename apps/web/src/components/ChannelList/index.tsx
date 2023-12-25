import { FC } from 'react';

import { Table, Loader, Container } from '@mantine/core';

import { channelsApi } from 'resources/channels';

type ChannelType = {
  channelId: string,
  lastMessage: string,
};
const ChannelList: FC = () => {
  const { data: channels, isLoading } = channelsApi.useGet();

  if (isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  const rows = channels?.map((info: ChannelType) => (
    <Table.Tr key={info.channelId}>
      <Table.Td align="center">{info.channelId}</Table.Td>
      <Table.Td align="center">{info.lastMessage}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container>
      <Table striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th align="center">Channel Id</Table.Th>
            <Table.Th align="center">Last message</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
};

export default ChannelList;
