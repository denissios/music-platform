import {RefObject, useEffect, useRef} from "react";

export const useObserve = (refElem: RefObject<HTMLElement>, refParent: RefObject<HTMLElement>,
                           canLoad: boolean, isLoading: boolean, trigger: number, callback: () => void) => {
    const observer = useRef<IntersectionObserver | null>();
    const options = {
        root: refParent.current,
        rootMargin: '0px 0px 5px 0px',
        threshold: 0
    }

    useEffect(() => {
        if(isLoading) return;
        if(observer.current) {
            observer.current.disconnect();
        }

        const cb = (entries: any, observer: any) => {
            if(entries[0].isIntersecting && canLoad) {
                callback();
            }
        }

        observer.current = new IntersectionObserver(cb, options);
        if(refElem.current) {
            observer.current.observe(refElem.current);
        }
    }, [trigger])
}