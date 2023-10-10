import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Disabled, Base, Container, Text, Clickable, Flex } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';
import { TextInput } from '/src/libs/inputs';

import { Logo } from '/src/components/logo';
import { Link } from '/src/components/link';
import { Background } from '/src/components/background';

import { useApi, useAuth } from '/src/libs/api';
import { useForm, useInputWithValidate, required, isEmail, length } from './libs';

export default () => {
    const navigate = useNavigate();
    const api = useApi();
    const auth = useAuth();

    React.useEffect(() => {
        if (auth.isLoggedIn === true) {
            navigate('/');
        }
    }, [auth.isLoggedIn]);

    const [step, setStep] = React.useState('email');

    const { email, code } = useForm({
        email: { rules: [required('Email is required'), isEmail('Your email appears to be invalid')] },
        code: { rules: [required('Code is required'), length(5, 'Invalid code')] },
    })

    // const email = useInputWithValidate(React.useState(''), );

    // const code = useInputWithValidate(React.useState(''), [
        
    // ]);

    const canProceed = React.useMemo(() => {
        if (step === 'email') {
            return !email.error;
        }

        if (step === 'code') {
            return !code.error;
        }
    }, [step, email, code]);

    const proceed = React.useCallback(async () => {
        if (step === 'email') {
            auth.getMethods(email.value).then((methods) => {
                // if (methods.includes('password')) {
                //     setStep('password');
                // } else {
                    return auth.generateCode(email.value).then(() => {
                        setStep('code');
                    });
                // }
            }).catch((e) => {
                // TODO NOTIFY
            });
        } 

        if (step === 'code') {
            auth.loginWithCode(email.value, code.value).then(() => {

            }).catch((e) => {
                // TODO notify
            });
        }

        if (step === 'password') {
            // todo
        }
    }, [navigate, step, api, code, email]);

    // console.log('token', api.session.token);

    // POST/session -> methods (code, password)
    // POST/session/code ->
    // POST/session/code/confirm -> token
    // POST/session/password -> token
    // GET/session -> User

    return (
        <Background>
            <Container pb="64px">
                <Flex mb="64px" justify="flex-start" p="48px 0">
                    <Logo />
                </Flex>
                
                <Text mb="16px" size="32px" weight="800" color={colors.white}>
                    Login
                </Text>

                {step === 'email' && (
                    <Base mw="400px" mb="24px">
                        <TextInput {...email} placeholder="Your email" size="14px" background={colors.alter} outline={email.touched && email.error ? `1px solid ${colors.yellow}` : null} />

                        {email.touched && email.error && (<Text mt="4px" size="14px" color={colors.yellow} weight="800">{email.error}</Text>)}
                    </Base>
                )}

                {step === 'code' && (
                    <Base mw="400px" mb="24px">
                        <Text mb="12px" size="14px" weight="400" color={colors.white}>
                            In order to let you in we need to ensure that the email you are using
                            belongs to you. We just have sent the validation code on <strong>{email.value}</strong>, please enter it 
                            in the field below.
                        </Text>
                        
                        <TextInput {...code} placeholder="Code from email" size="14px" background={colors.alter} outline={code.touched && code.error ? `1px solid ${colors.yellow}` : null} />

                        {code.touched && code.error && (<Text mt="4px" size="14px" color={colors.yellow} weight="800">{code.error}</Text>)}
                    </Base>
                )}
                
                <Disabled disabled={!canProceed}>
                    <Clickable mb="32px" color={colors.dark} p="8px 12px" radius="4px" onClick={proceed}>
                        <Text color={colors.white} weight="800" size="16px">Continue</Text>
                    </Clickable>
                </Disabled>            
            </Container>
        </Background>
    );
};
