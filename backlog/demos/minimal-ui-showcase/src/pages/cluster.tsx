import React from 'react';
import styled from 'styled-components';

import Select from '/components/select';
import Pagination from '/components/pagination';
import Flex from '/components/flex';
import { Card, FlatCard } from '/components/card';
import { Heading, Subheading, Text, Sup } from '/components/text';
import * as Table from '/components/table';

import { Office } from '@styled-icons/icomoon/Office';
import { ArrowsBidirectional } from '@styled-icons/fluentui-system-regular/ArrowsBidirectional';

const TEXT_COLOR = '#21224e';

const Tag = styled(Text)`
  background: #6c6dff;
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  display: inline;
`;

const GROUP_BY_OPTIONS = [
  { value: 'company', label: 'Company', view: <Flex justify="flex-start" gap={8}><Office color={TEXT_COLOR} height={18} /> Company</Flex> },
  { value: 'channel', label: 'Channel', view: <Flex justify="flex-start" gap={8}><ArrowsBidirectional color={TEXT_COLOR} height={18} /> Channel</Flex> },
];

export default () => {
  const [groupBy, setGroupBy] = React.useState(null as string | null);

  return (
    <div>
      <Heading style={{ marginBottom: 12 }}>Cluster</Heading>

      <FlatCard style={{ padding: 24, marginBottom: 36 }}>
        <Flex gap={8} justify="flex-start" style={{ marginBottom: 24 }}>
          <Subheading>Queue status</Subheading>
          <Tag>Good</Tag>
        </Flex>

        <Flex justify="flex-start" gap={48}>
          <div>
            <Heading>182</Heading>
            <Sup>Requests last 24h</Sup>
          </div>

          <div>
            <Heading>99.84%</Heading>
            <Sup>Success Rate</Sup>
          </div>
        </Flex>
      </FlatCard>

      <Flex style={{ marginBottom: 12 }} justify="space-between">
        <Subheading>Charts</Subheading>
        <Flex style={{ width: 'auto' }} gap={8}>
          <Sup>Chart Values Grouping</Sup>
          <Select value={groupBy} onChange={setGroupBy} options={GROUP_BY_OPTIONS} placeholder="Group By" />
        </Flex>
      </Flex>

      <Card style={{ padding: 12, marginBottom: 36 }}>

      </Card>

      <Subheading style={{ marginBottom: 12 }}>Requests</Subheading>

      <div style={{ marginBottom: 24 }}>
        <Table.HeaderRow>
          <Table.HeaderItem>Worker</Table.HeaderItem>
          <Table.HeaderItem>Task</Table.HeaderItem>
          <Table.HeaderItem>Status</Table.HeaderItem>
          <Table.HeaderItem>ETA</Table.HeaderItem>
          <Table.HeaderItem>Awaited</Table.HeaderItem>
        </Table.HeaderRow>
        <Table.Row>
          <Table.Item>LPG_LIT2</Table.Item>
          <Table.Item>Corridor: Mexico-US</Table.Item>
          <Table.Item><Tag>In Progress</Tag></Table.Item>
          <Table.Item>in 3 mins</Table.Item>
          <Table.Item>by 18 jobs</Table.Item>
        </Table.Row>
        <Table.Row>
          <Table.Item>LPG_LIT2</Table.Item>
          <Table.Item>Corridor: Mexico-US</Table.Item>
          <Table.Item><Tag>In Progress</Tag></Table.Item>
          <Table.Item>in 3 mins</Table.Item>
          <Table.Item>by 18 jobs</Table.Item>
        </Table.Row>
      </div>

      <Flex justify="flex-end">
        <Pagination />
      </Flex>
    </div>
  );
};
