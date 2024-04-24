import React from 'react';

import Flex from '/components/flex';
import Focus from '/components/focus';
import Button from '/components/button';
import { Card, FlatCard } from '/components/card';
import { Heading, Subheading, Label, Sup } from '/components/text';
import * as Table from '/components/table';

import { Fire } from '@styled-icons/fa-solid/Fire';

export default () => {
  return (
    <>
      <Heading style={{ marginBottom: 24 }}>Available Insurances</Heading>

      <Card style={{ padding: 24, marginBottom: 24 }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Flex justify="flex-start" gap={12}>
            <Focus color="#6c6dff">
              <Fire height={20} color="white" />
            </Focus>

            <div>
              <Subheading style={{ marginBottom: 4 }}>Insurance for Volkswagen Golf</Subheading>
              <Sup>Last updated 12 June</Sup>
            </div>
          </Flex>

          <Button><Flex gap={8}>Apply</Flex></Button>
        </Flex>

        <Flex style={{ marginBottom: 24 }}>
          <FlatCard style={{ width: '100%', padding: 24 }}>
            <Flex style={{ marginBottom: 20 }} justify="space-between">
              <Label>Insurance Amounts</Label>
              <Sup style={{ textDecoration: 'underline', cursor: 'pointer' }}>What the hell is even that?</Sup>
            </Flex>

            <Flex justify="flex-start" gap={48}>
              <div>
                <Heading>$40,000.00</Heading>
                <Sup>Total Coverage</Sup>
              </div>

              <div>
                <Heading>$20,000.00</Heading>
                <Sup>Injury Coverage</Sup>
              </div>

              <div>
                <Heading>$10,000.00</Heading>
                <Sup>Civil Responsibility Coverage</Sup>
              </div>
            </Flex>
          </FlatCard>
        </Flex>

        <div>
          <Table.HeaderRow>
            <Table.HeaderItem>Date</Table.HeaderItem>
            <Table.HeaderItem>Amount</Table.HeaderItem>
            <Table.HeaderItem>Interest</Table.HeaderItem>
            <Table.HeaderItem>Body</Table.HeaderItem>
            <Table.HeaderItem>Rest</Table.HeaderItem>
          </Table.HeaderRow>
          <Table.Row>
            <Table.Item>12.08</Table.Item>
            <Table.Item>$200.12</Table.Item>
            <Table.Item>$120.12</Table.Item>
            <Table.Item>$80</Table.Item>
            <Table.Item>$4000</Table.Item>
          </Table.Row>
          <Table.Row>
            <Table.Item>12.08</Table.Item>
            <Table.Item>$200.12</Table.Item>
            <Table.Item>$120.12</Table.Item>
            <Table.Item>$80</Table.Item>
            <Table.Item>$4000</Table.Item>
          </Table.Row>
          <Table.Row>
            <Table.Item>12.08</Table.Item>
            <Table.Item>$200.12</Table.Item>
            <Table.Item>$120.12</Table.Item>
            <Table.Item>$80</Table.Item>
            <Table.Item>$4000</Table.Item>
          </Table.Row>
        </div>
      </Card>
    </>
  );
};
