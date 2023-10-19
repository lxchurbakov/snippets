import React from 'react';
import styled from 'styled-components';
import { useBetween } from 'use-between';

import { Card, Flex, Text } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';

// import { Check } from '@styled-icons/boxicons-regular/Check';
// import { InfoSquare } from '@styled-icons/boxicons-solid/InfoSquare';
// import { Warning } from '@styled-icons/material/Warning';
// import { ErrorAlt } from '@styled-icons/boxicons-solid/ErrorAlt';

//
// Firt of all we implement some logic to store
// and add/remove notifications
//

const AUTO_CLOSE_TIMEOUT = 5 * 1000;

export type Notification = {
    key: string;
    type: 'success' | 'info' | 'warning' | 'error';
    text: string;
    keep?: boolean;
};

const _useNotifications = () => {
    const [notifications, setNotifications] = React.useState([] as Notification[]);

    const push = React.useCallback((n: Notification) => {
        setNotifications(($) => {
            return $.filter(($$) => $$.key !== n.key).concat([n]);
        });

        if (!n.keep) {
            setTimeout(() => {
                setNotifications(($) => $.filter(($$) => $$ !== n));
            }, AUTO_CLOSE_TIMEOUT);
        }
    }, [setNotifications]);

    return { notifications, push };
};

export const useNotifications = () => useBetween(_useNotifications);

//
// Now we introduce some view to display them
// on the screen
//

const NotificationsWrap = styled(Flex).attrs({ 
    dir: 'column-reverse',
    gap: '8px',
})`
    position: fixed;
    bottom: 88px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
`;

const Notification = styled(Card).attrs({
    color: colors.dark,
    p: '8px 12px',
    radius: '4px',
})`
    box-shadow: 0 0 4px 0 rgba(0,0,0,.2);    
`;

// {n.type === 'success' && (
//     <Check height={24} color={colors.white} />
// )}
// {n.type === 'warning' && (
//     <Warning height={20} color={colors.white} />
// )}
// {n.type === 'info' && (
//     <InfoSquare height={20} color={colors.white} />
// )}
// {n.type === 'error' && (
//     <ErrorAlt height={16} color={colors.white} />
// )}

export const Notifications = () => {
    const { notifications } = useNotifications();

    return (
        <NotificationsWrap>
            {notifications.map((n) => (
                <Notification key={JSON.stringify(n)}>
                    <Flex gap="8px">
                        <Text size="14px" color={colors.white} weight="400">{n.text}</Text>
                    </Flex>
                </Notification>
            ))}
        </NotificationsWrap>
    );
};
