import { FC, useState } from 'react';

import { TextInput, Group, Button, Container } from '@mantine/core';

import { channelsApi } from 'resources/channels';

const ChannelInput: FC = () => {
  const { mutate: addChannel, isLoading } = channelsApi.useAdd();

  const [channelId, setChannelId] = useState('');
  const [error, setError] = useState('');

  const onClick = () => {
    addChannel(
      channelId,
      {
        onError: (err) => {
          const message = err?.data?.error || 'Something went wrong';

          setError(message);
        },
        onSuccess: () => {
          setChannelId('');
          setError('');
        },
      },
    );
  };

  return (
    <Container>
      <Group align="center">
        <TextInput
          placeholder="Write channel Id"
          value={channelId}
          onChange={(event) => setChannelId(event.currentTarget.value)}
          size="xs"
          error={error}
        />
        <Button
          variant="filled"
          size="xs"
          disabled={isLoading}
          onClick={onClick}
        >
          Add Channel
        </Button>
      </Group>
    </Container>
  );
};

export default ChannelInput;
