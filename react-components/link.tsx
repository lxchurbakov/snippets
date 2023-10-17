import React from 'react';
import styled from 'styled-components';

import { Clickable } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';

const LinkLine = styled.div`
    width: 100%;
    height: 8px;
    z-index: 1;
    left: 0;
    bottom: 0;
    background: ${colors.grey};
    position: absolute;
    transition: height 100ms ease;
`;

const LinkBase = styled(Clickable)`
    position: relative;
    display: inline;
    font-weight: 700;

    padding: 0 1px;

    &:hover ${LinkLine} {
        height: 100%;
    }
`;

const LinkCore = styled.a`
    position: relative;
    z-index: 2;
`;

export const Link = ({ href, children }) => {
    return (
        <LinkBase>
            <LinkCore href={href}>{children}</LinkCore>
            <LinkLine />
        </LinkBase>
    );
}; 
