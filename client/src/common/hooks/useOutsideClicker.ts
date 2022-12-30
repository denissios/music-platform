import {RefObject, useEffect} from "react";

export const useOutsideClicker = (ref: RefObject<HTMLElement>, setIsVisible: (visible: boolean) => void, notTriggeredRef?: RefObject<HTMLElement>) => {
    useEffect(() => {
        function handleClickOutside(event: TouchEvent | MouseEvent) {
            if ((!notTriggeredRef?.current || !notTriggeredRef?.current.contains(event.target as Node))
                && ref.current && !ref.current.contains(event.target as Node)) {
                setIsVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}