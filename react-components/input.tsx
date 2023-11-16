import React from 'react';
import styled from 'styled-components';

import * as theme from '/src/libs/theme';

import { Base, BaseProps } from '/src/libs/atoms';

export type StyledInputProps = {
    size?: string;
    weight?: string;
    color?: string;
    background?: string;
    border?: string;
    outline?: string;
    padding?: string;
};

const StyledInput = styled.input<StyledInputProps>`
    font-family: Manrope, sans;
    font-size: ${props => props.size || '16px'};
    font-weight: ${props => props.weight || 400};
    color: ${props => props.color || theme.colors.text};
    box-sizing: border-box;
    width: 100%;
    display: block;

    border-radius: 4px;
    border: ${props => props.border || 'none'};
    padding: ${props => props.padding || '8px 12px'};
    background: ${props => props.background || 'transparent'};

    outline: ${props => props.outline || 'none'};;
`;

export type Input<T> = { value: T, onChange: ($: T) => void };

export type TextInputProps = {
    type?: string;
    placeholder?: string;
    onFocus?: () => void;
    onBlur?: () => void;
};

export const LineInput = ({ 
    type, placeholder, value, onChange, size, weight, color, background, border, outline, padding, onFocus, onBlur, ...props 
}: TextInputProps & StyledInputProps & Input<string> & BaseProps) => {
    return (
        <Base w="100%" {...props}>
            <StyledInput 
                onFocus={onFocus}
                onBlur={onBlur}
                type={type} 
                placeholder={placeholder} 
                value={value || ''} 
                onChange={(e) => onChange(e.target.value || '')} 
                {...{ size, weight, color, background, border, outline, padding }} 
            />
        </Base>
    );
};
