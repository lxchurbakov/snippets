import React from 'react';
import styled from 'styled-components';

import { Clickable } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';
import { useHistory } from '/src/libs/history';

const LinkLine = styled.div<{ color: string }>`
    width: 100%;
    height: 8px;
    z-index: 1;
    left: 0;
    bottom: 0;
    background: ${props => props.color || colors.grey};
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

export const Link = ({ color, href, children }: any) => {
    const history = useHistory();

    const navigate = React.useCallback((e) => {
        e.preventDefault();

        history.navigate(href);
    }, [href, history]);

    return (
        <LinkBase>
            <LinkCore onClick={navigate} href={href}>{children}</LinkCore>
            <LinkLine color={color} />
        </LinkBase>
    );
}; 
