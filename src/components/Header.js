import React from 'react';
import styled from 'styled-components';
import { Header } from 'semantic-ui-react';

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
  height: 5vh;
`;

const PushDown = styled.div`margin-top: 2vh;`;

export default ({ channelName }) => (
  <HeaderWrapper>
    <PushDown>
      <Header textAlign="center">#{channelName}</Header>
    </PushDown>
  </HeaderWrapper>
);
