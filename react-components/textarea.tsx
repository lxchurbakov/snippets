import React from 'react';
import styled from 'styled-components';

import { Base } from '/src/libs/atoms';

const StyledTextArea = styled.textarea<any>`
    font-family: Manrope, sans;
    font-size: ${props => props.size || '16px'};
    font-weight: ${props => props.weight || 400};

    color: ${props => props.color || theme.colors.white};
    box-sizing: border-box;
    display: block;

    border-radius: 4px;
    border: ${props => props.border || 'none'};
    padding: ${props => props.padding || '8px 12px'};
    background: ${props => props.background || 'transparent'};

    outline: ${props => props.outline || 'none'};
    min-height: 80px;
    min-width: 100%;
    max-width: 100%;
`;

export const TextInput = ({ placeholder, value, onChange, padding, size, weight, color, background, border, outline, ...props }) => {
    return (
        <Base w="100%" {...props}>
            <StyledTextArea padding={padding} value={value || ''} placeholder={placeholder} onInput={(e) => onChange(e.target.value || '')} {...{ size, weight, color, background, border, outline }}/>
        </Base>
    );  
};
