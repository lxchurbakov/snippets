import _ from 'lodash';
import React from 'react';

import { Predicate } from './types';

// Use local storage as useState but to keep
// information inside local storage, you can 
// combine this with use between if you want
// it to trigger changes everywhere like in auth
export const useLocalStorage = <T,>(key: string, def: T) => {
    const [value, setValue] = React.useState(JSON.parse(localStorage.getItem(key) || JSON.stringify(def)) as T);

    React.useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [value]);

    return [value, setValue] as const;
};

// A hook that works like an async pipe
// in angular, but for react
export const useObservable = (r) => {
    const [value, setValue] = React.useState(null);

    React.useEffect(() => r((value) => setValue(value)), [r]);

    return value;
};

// Just 2 stupid hooks I use to hack through 
// the bugs
export const useForceUpdate = ([_, setState] = React.useState(true)) => 
    () => setState((v) => !v);

export const useTicker = ([state, setState] = React.useState(true)) => 
    React.useMemo(() => ({ state, update: () => setState($ => !$) }), [state, setState])

// Like useQuery but simple
export const useAsyncMemo = <T,>(predicate: Predicate<[], Promise<T>>, deps: React.DependencyList, defLoading = false) => {
    const [loading, setLoading] = React.useState(defLoading);
    const [value, setValue] = React.useState(null as T | null);
    const [error, setError] = React.useState(null as Error | null);

    React.useEffect(() => {
        setLoading(true);

        predicate().then((value) => {
            setValue(value);
        }).catch((error) => {
            setError(error);
        }).then(() => {
            setLoading(false);
        });
    }, deps);

    return [value, loading, error] as const;
};

// Returns the previous value of a value,
// good for compare and save kind of thing
export const usePreviousValue = <T,>(value: T) => {
    const ref = React.useRef(value);
    const pref = React.useRef(value);

    React.useEffect(() => {
        pref.current = ref.current;
        ref.current = value;
    }, [value])

    return pref;
};

// Just attach listener and then remove it
export const useListener = (target: any, event: string, callback: EventListenerOrEventListenerObject, deps: React.DependencyList) => {
    React.useEffect(() => {
        target.addEventListener(event, callback);
        return () => target.removeEventListener(event, callback);
    }, [...deps, callback]);
};

// <Modal ref={useClickOutside(onHide)}>
export const useClickOutside = (predicate) => {
    const ref = React.useRef(null);

    useListener(window, 'click', (e) => {
        if (!ref.current?.contains(e.target)) {
            predicate();
        }
    }, [predicate]);

    return ref;
};

// If you don't want some kind of effect
// to depend on a callback but wnat the 
// freshest version of a callback to be
// available, this one is fo you
export const useRefCallback = (callback) => {
    const ref = React.useRef(null);
  
    React.useEffect(() => {
      ref.current = callback;
    }, [callback]);
  
    return ref;
};

// // That one I will fix
// export const useField = <T,>([value, setValue], path, def = null) => {
//     return [
//         //
//         React.useMemo(() => {
//             return _.get(value, path, def)
//         }, [value, path, def]),
//         //
//         React.useCallback(($) => {
//             if (typeof $ === 'function') {
//                 setValue((old) => {
//                     return { ..._.update(old, path, $) };
//                 });
//             } else {
//                 setValue((old) => {
//                     return { ..._.set(old, path, $) };
//                 });
//             }
//         }, [setValue]),
//     ] as [T, ($: (T | (($$: T) => T))) => void];
// };

// That one I will fix too

// export const useWorker = (code, { onload, onerror } = { onload: () => null, onerror: () => null }) => {
//     const wsRef = React.useRef(null);
//     const listenersRef = React.useRef([]);
//     const postMessageRef = React.useRef(null);

//     React.useEffect(() => {
//         wsRef.current = new Worker(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })));

//         onload();
        
//         wsRef.current.onmessage = function (e) {
//             listenersRef.current.forEach(($) => $(e.data));
//         };

//         wsRef.current.onerror = onerror;

//         postMessageRef.current = function (data) {
//             wsRef.current.postMessage(data);
//         };

//         return () => {
//             wsRef.current.terminate();
//         };
//     }, [code]);

//     const on = React.useCallback((listener) => {
//         listenersRef.current.push(listener);
//         return () => { listenersRef.current = listenersRef.current.filter(($) => $ !== listener) };
//     }, []);

//     const emit = React.useCallback((data) => {
//         postMessageRef.current?.(data);
//     }, []);

//     return React.useMemo(() => ({ on, emit }), [on, emit]);
// };

//
// const stringify = <T,>(value: T) => {
//     return JSON.stringify(value, (key, value) => {
//         if (typeof value === 'bigint') {
//             return value.toString();
//         }

//         return value;
//     }) as string;
// };

// const parse = <T,>(value: string) => {
//     return JSON.parse(value) as T;
// };

// export const useWebSocket = (url: string, onopen?: any) => {
//     const [ws, setWs] = React.useState(null);

//     React.useEffect(() => {
//         const ws = new WebSocket(url);

//         setWs(ws);

//         return () => ws.close();
//     }, [url]);

//     const listenersRef = React.useRef([]);
    
//     const on = React.useCallback((listener) => {
//         listenersRef.current.push(listener);
//         return () => {
//             listenersRef.current = listenersRef.current.filter(($) => $ !== listener);
//         };
//     }, []);

//     React.useEffect(() => {
//         if (ws) {
//             ws.onmessage = function (e) {
//                 const data = parse(e.data);

//                 listenersRef.current.forEach(($) => $(data));
//             }
//         }
//     }, [ws]);

//     React.useEffect(() => {
//         if (ws && onopen) {
//             ws.onopen = onopen;
//         }
//     }, [ws, onopen]);

//     const emit = React.useCallback((data) => {
//         if (ws?.readyState) {
//             ws.send(stringify(data));
//         }
//     }, [ws]);

//     return React.useMemo(() => ({ on, emit }), [on, emit]);
// };

// An extension of usePreviousValue hook - useEffect, but accept
// 2 values - previous and new one
export const useChanged = <T,>(value: T, predicate: (prev: T, curr: T) => void) => {
    const previousValue = usePreviousValue(value);
    const predicateRef = useRefCallback(predicate);

    React.useEffect(() => {
        if (value !== previousValue.current) {
            predicateRef.current(previousValue.current, value);
        }
    }, [value]);
};

// These 2 need to be refactored

// export const useDebounced = <A extends any[], R = any>(time: number, callback: Predicate<A, R>) => {
//     const timeoutRef = React.useRef(null);
//     const callbackRef = useRefCallback(callback);

//     return React.useCallback((...args: A) => {
//         if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//         }

//         timeoutRef.current = setTimeout(() => {
//             callbackRef.current(...args);
//         }, time);
//     }, [])
// };

// export const useDebouncedEffect = (predicate: Predicate<[], void>, time: number, deps: React.DependencyList) => {
//     const debouncedPredicateRef = useRefCallback(useDebounced(time, predicate));

//     React.useEffect(() => {
//         debouncedPredicateRef.current();
//     }, deps);
// };

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

// This one I will debug and update
// export const useScrollNavigation = () => {
//     const collection = React.useRef({});

//     const [active, setActive] = React.useState(null as string | null);

//     useListener(window, 'scroll', () => {
//         setActive(null);
//     }, [setActive]);

//     const anchor = React.useCallback((name: string) => {
//         return (node: HTMLElement) => {
//             collection.current[name] = node;
//         };
//     }, []);

//     const navigate = React.useCallback((name: string) => {
//         if (!collection.current[name]) {
//             throw new Error(`Looks like ${name} is not presented on the page`);
//         }

//         collection.current[name].scrollIntoView({
//             behavior: 'smooth'
//         });

//         // setTimeout(() => {
//         //     setActive(name);
//         // }, 100);
//     }, []);

//     return { anchor, navigate, active };
// };

export const getWindowWidth = () => {
    return window.innerWidth;
};

export const useWindowWidth = () => {
    const [size, setSize] = React.useState(getWindowWidth());
    const listener = React.useMemo(() => _.debounce(() => setSize(getWindowWidth()), 100), [setSize]);

    useListener(window, 'resize', listener, []);

    return size;
};
