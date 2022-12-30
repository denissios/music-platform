import React from "react";

export const getCookie = (name: string): string => {
    let cookieValue: string = '';
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const getTheme = () => {
    const theme = window.localStorage.getItem('theme');
    if(theme === 'dark' || theme === 'light') {
        return theme;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: light)');
    return userMedia.matches ? 'light' : 'dark';
}

export const calculateMinutesSeconds = (time: number) => {
    const seconds = time % 60;
    const minutes = (time - seconds) / 60;
    return {seconds, minutes};
}

export const makeBold = (item: string, keyword: string) => {
    if(!keyword) {
        return (item);
    }

    const re = new RegExp(keyword, 'g')
    return (
        item.replace(re, '<b>' + keyword + '</b>')
    )
}

export const checkOutOfBottomScreen = (ref: React.RefObject<HTMLDivElement>) => {
    if(ref.current) {
        const rect = ref.current.getBoundingClientRect();
        return rect.bottom > window.innerHeight;
    }
}

export const getElementHeight = (ref: React.RefObject<HTMLDivElement>) => {
    return ref.current ? ref.current.getBoundingClientRect().height : 0;
}