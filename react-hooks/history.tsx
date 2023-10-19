import React from 'react';
import { useBetween } from 'use-between';

import { useForceUpdate } from './hooks';

const _useHistory = () => {
    const forceUpdate = useForceUpdate();

    const path = window.location.pathname;
    const length = history.length;
    const hash = window.location.hash.substring(1);

    const push = React.useCallback((url: string) => {
        history.pushState({}, '', url);
        forceUpdate();
    }, [forceUpdate]);

    const replace = React.useCallback((url: string) => {
        history.replaceState({}, '', url);
        forceUpdate();
    }, [forceUpdate]);

    const navigate = React.useCallback((ref: string) => {
        if (ref.startsWith('/')) {
            push(ref);
        } else if (ref.startsWith('#')) {
            push(path + ref);
        } else {
            window.location.href = ref;
        }
    }, [push, path]);

    return React.useMemo(() => ({ navigate, push, replace, length, path, hash }), [forceUpdate]);
};

export const useHistory = () => useBetween(_useHistory);

export const useScrollLink = (name: string) => {
    const ref = React.useRef();
    const history = useHistory();

    React.useEffect(() => {
        if (history.hash === name && ref.current) {
            const node = ref.current as HTMLElement;
            const rect = node.getBoundingClientRect();
            const offset = rect.top + window.scrollY - (window.innerHeight * .2);

            window.scrollTo({ top: offset, behavior: 'smooth'});
        }
    }, [history]);

    return ref;
};

// That one I will split into 2
export const useQueryParam = (name: string) => {
    const forceUpdate = useForceUpdate();
    const params = new URLSearchParams(window.location.search);
    const value = params.get(name) || null;

    const setValue = (v) => {
        const params = new URLSearchParams(window.location.search);

        if (v) {
            params.set(name, v);
        } else {
            params.delete(name);
        }

        window.history.pushState({}, '', window.location.pathname + '?' + params.toString());
        forceUpdate();
    };

    return [value, setValue] as const;
};
