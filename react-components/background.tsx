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
