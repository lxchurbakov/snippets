import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import Flex from '/components/flex';
import Focus from '/components/focus';
import Input from '/components/input';
import { Text, Sup } from '/components/text';

import { Fire } from '@styled-icons/fa-solid/Fire';
import { User } from '@styled-icons/boxicons-solid/User';
import { LayerGroup } from '@styled-icons/fa-solid/LayerGroup';

const Wrap = styled.div`
  height: 100%;
  width: 980px;
`;

export default ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = React.useState('');
  const navigate = useNavigate();

  return (
    <Wrap>
      <Flex style={{ marginBottom: 24, padding: 12 }} gap={12}>
        <Flex style={{ width: 'auto', flexShrink: 0, paddingRight: 12, borderRight: '1px solid #ccc' }} gap={12}>
          <img src="//notarealhuman.com/face" style={{ width: 40, height: 40, borderRadius: 8 }} />

          <div>
            <Text style={{ marginBottom: 4 }}>Alex Swensson</Text>
            <Sup>From Acme Inc.</Sup>
          </div>
        </Flex>

        <Flex style={{ width: 'auto' }} gap={12}>
          <Focus onClick={() => navigate('/')} color="#ff3b38" clickable>
            <Fire height={20} color="white" />
          </Focus>

          <Focus onClick={() => navigate('/messages')} color="#6c6dff" clickable>
            <User height={20} color="white" />
          </Focus>

          <Focus onClick={() => navigate('/cluster')} color="#07c6c7" clickable>
            <LayerGroup height={20} color="white" />
          </Focus>
        </Flex>

        <Input placeholder="Search for entries..." value={search} onChange={setSearch} />
      </Flex>

      {children}
    </Wrap>
  )
};
