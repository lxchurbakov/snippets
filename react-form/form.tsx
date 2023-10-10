import React from 'react';

import { useApi } from '/src/api';
import { Base, Disabled, Text } from '/src/libs/atoms';
import { StringInput, TextInput } from '/src/libs/inputs';
import { useInput, useField, useValidate, useRefCallback, useDebouncedEffect } from '/src/libs/hooks';
import { isValidUrl } from '/src/libs/utils';
import { colors } from '/src/libs/theme';

import { Spinner } from '/src/components/spinner';
import { Button } from '/src/components/button';

export const Form = ({ value, onChange, onSubmit, ...props }) => {
    const api = useApi();

    const link = useInput(useField([value, onChange], 'link', ''));
    const title = useInput(useField([value, onChange], 'title', ''));
    const description = useInput(useField([value, onChange], 'description', ''));

    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(false);

    const linkValidity = useValidate(link, [
        (s: string) => !!s ? null : 'Нужно заполнить',
        (s: string) => isValidUrl(s) ? null : 'Неверный URL',
    ]);

    const showFields = React.useCallback(($) => {
        title.onChange($.title);
        description.onChange($.description);

        setVisible(true);
    }, [title, description, setVisible]);

    const showFieldsRef = useRefCallback(showFields);

    const checkLink = React.useCallback((url: string) => {
        setLoading(true);
        api.references.meta(url).then(($) => {
            showFieldsRef.current($);
        }).catch((e) => {
            // TODO notify
        }).then(() => {
            setLoading(false);
        });
    }, [api, setLoading]);

    const checkLinkRef = useRefCallback(checkLink);

    useDebouncedEffect(() => {
        if (!linkValidity.error) {
            checkLinkRef.current(link.value);
        }
    }, 500, [linkValidity.error, link.value]);

    return (
        <Base mw="400px" {...props}>
            <Base mb="12px">
                <StringInput background="#191919"  {...link} placeholder="Ссылка на лонгрид" outline={linkValidity.touched && linkValidity.error ? `1px solid ${colors.yellow}` : null} />
                {linkValidity.touched && linkValidity.error && (<Text mt="4px" size="14px" color={colors.yellow} weight="800">{linkValidity.error}</Text>)}
            </Base>

            {visible && (
                <>
                    <StringInput background="#191919" mb="12px" {...title} placeholder="Название" />
                    <TextInput background="#191919" mb="12px" {...description} placeholder="Описание" />
                </>
            )}
            
            {loading ? (
                <Spinner />
            ) : (
                <Disabled disabled={linkValidity.error}>
                    <Button onClick={onSubmit}>Сохранить</Button>
                </Disabled>
            )}
            
        </Base>
    );
};