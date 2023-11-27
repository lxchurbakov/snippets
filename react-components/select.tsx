import React from 'react';
import styled from 'styled-components';

import { Input } from '/src/components/input';

import { Clickable, Relative, Absolute, Card, Text } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';
import { useClickOutside } from '/src/libs/hooks';

const HoverableClickable = styled(Clickable)`
    &:hover {
        background: ${colors.background};
    }
`;

export const Select = ({ padding, size, placeholder, value, onChange, options, background, color, ...props }: any) => {
    const option = React.useMemo(() => {
        return options.find(($) => $.value === value) || null;
    }, [value, options]);

    const [visible, setVisible] = React.useState(false);

    const focus = React.useCallback(() => {
        setVisible(true);
    }, [setVisible]);

    const blur = React.useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const select = React.useCallback((value) => {
        onChange(value);
    }, [onChange]);

    return (
        <Relative ref={useClickOutside(blur)} w="100%" {...props}>
            <Input 
                padding={padding}
                size={size}
                placeholder={placeholder} background={background} color={color} 
                value={option?.label} onChange={() => {}} onFocus={focus} 
            />

            {visible && (
                <Absolute style={{ zIndex: 80 }} left="0" top="52px" w="100%">
                    <Card p="8px 0px" w="100%" background={colors.dark}>
                        {options.map((option) => (
                            <HoverableClickable key={option.value} onClick={() => select(option.value)} p="8px 16px" w="100%">
                                <Text size={size} color={colors.white}>{option.label}</Text>
                            </HoverableClickable>
                        ))}
                    </Card>
                </Absolute>
            )}
        </Relative>
    );
};
