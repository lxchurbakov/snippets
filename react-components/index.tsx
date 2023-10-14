// background.tsx

import React from 'react';

import { BaseProps, Relative, Absolute } from '/src/libs/atoms';

export const Background = ({ children, ...props }: React.PropsWithChildren<BaseProps>) => {
    return (
        <Relative>
            <Absolute style={{ zIndex: -1 }} left="0" top="0" {...props}>
                {children}
            </Absolute>
        </Relative>
    );
};

// canvas.tsx

import React from 'react';

export const Canvas = ({ render }) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const pixelRatio = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;

        if (!canvas) {
            return; // TODO hack for redirect out
        }

        const rect = canvas.getBoundingClientRect();

        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        canvas.width = rect.width * pixelRatio;
        canvas.height = rect.height * pixelRatio;

        const context = canvas.getContext('2d');
        context.scale(pixelRatio, pixelRatio);

        render(context, rect);
    }, []);

    return (
        <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef} />
    );
};

// link.tsx
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

// logo.tsx

import React from 'react';

import { Clickable, Text } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';

export const Logo = ({ onClick }: { onClick?: () => void }) => {
    return (
        <Clickable onClick={onClick} border={`2px solid ${colors.white}`} p="1px 8px" radius="8px">
            <Text size="16px" weight="800" color={colors.white}>mensa</Text>
        </Clickable>
    );
};

