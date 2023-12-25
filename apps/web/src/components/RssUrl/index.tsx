import { Blockquote, CopyButton, ActionIcon, Tooltip, rem, Stack } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

import { tokenUtil } from 'utils';

import classes from './RssUrl.module.css';

const RssUrl = () => {
  const tokenInfo = tokenUtil.getInfo();

  if (!tokenInfo?.rssUrl) {
    return null;
  }

  const icon = (
    <CopyButton value={tokenInfo.rssUrl} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
          <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
            {copied ? (
              <IconCheck style={{ width: rem(16) }} />
            ) : (
              <IconCopy style={{ width: rem(16) }} />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );

  return (
    <Stack align="center">
      <Blockquote color="blue" cite="Please click on the icon for a link to a copy" icon={icon} mt="xl" radius="xl" className={classes.wrapper}>
        RSS feed
      </Blockquote>
    </Stack>
  );
};

export default RssUrl;
