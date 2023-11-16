import styled, { keyframes } from 'styled-components';

import { colors } from '/src/libs/theme';

import { SpinnerIos } from '@styled-icons/fluentui-system-regular/SpinnerIos';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled(SpinnerIos).attrs((props) => ({
    color: props.color || colors.white,
    size: '24px'
}))`
    animation: ${rotate} 1.5s linear infinite;
`;
