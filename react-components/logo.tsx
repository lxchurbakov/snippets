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
