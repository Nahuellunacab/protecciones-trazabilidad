import {
    useEffect,
    useState
} from "react";

function useDebouncedValue<T>(
    valor: T,
    delayMs: number = 350
): T {

    const [valorDebounced, setValorDebounced] =
        useState(valor);

    useEffect(() => {

        const timeoutId = setTimeout(() => {

            setValorDebounced(valor);

        }, delayMs);

        return () =>
            clearTimeout(timeoutId);

    }, [valor, delayMs]);

    return valorDebounced;
}

export default useDebouncedValue;
