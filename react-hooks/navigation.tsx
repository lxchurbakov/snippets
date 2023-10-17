const _useHistory = () => {
    const forceUpdate = useForceUpdate();

    const path = window.location.pathname;
    const length = history.length;

    const push = React.useCallback((url: string) => {
        history.pushState({}, '', url);
        forceUpdate();
    }, [forceUpdate]);

    const replace = React.useCallback((url: string) => {
        history.replaceState({}, '', url);
        forceUpdate();
    }, [forceUpdate]);

    return React.useMemo(() => ({ push, replace, length, path }), [forceUpdate]);
};

export const useHistory = () => useBetween(_useHistory);


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