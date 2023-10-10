export const useInput = <T,>([state, setState] = React.useState<T>(null)) => 
    React.useMemo(() => ({ value: state, onChange: setState }) as any, [state, setState]);
    
    
export const useValidate = (input, rules) => {
    const [touched, setTouched] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    useHotRunEffect(() => {
        setTouched(true);
    }, [input]);

    React.useEffect(() => {
        setError(null);

        for (let rule of rules) {
            const error = rule(input.value);

            if (error) {
                setError(error);
                break;
            }
        }    
    }, [input, ...rules, setError])

    return React.useMemo(() => ({ touched, error }), [error, touched]);
};

export const useInputWithValidate = ([state, setState] = React.useState(''), rules) => {
    const input = useInput([state, setState]);
    const validate = useValidate(input, rules);

    return React.useMemo(() => ({ ...input, ...validate }), [input, validate]);
};

export const useForm = <T extends { [key: string]: { def?: any, rules?: any[] } }>(config: T) => {
    let result = {} as { [key in keyof T]: { value: any, onChange: any, touched: boolean, error: null | string, } };

    for (let key in config) {
        result[key] = useInputWithValidate(React.useState(config[key].def || ''), config[key].rules || []);
    }

    return result;
};