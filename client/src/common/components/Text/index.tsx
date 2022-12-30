import React from 'react';
import cn from 'classnames';
import './index.css';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    variant:
        | 'header'
        | 'subheader1'
        | 'subheader2'
        | 'body'
        | 'small'
        | 'xs'
        | 'xxs'
    color?: 'primary' | 'purple' | 'white' | 'grey' | 'medium-grey' | 'light-grey' | 'red' | 'green',
    as?: string | React.ComponentType<any>,
    bold?: boolean,
    italic?: boolean,
    boldItalic?: boolean
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
    ({ variant, as = 'span', color = 'primary', className,
         bold, italic, boldItalic, ...props }, ref) => {
        const Component = as;

        return <Component className={cn(`text__${variant}`, `text__${color}`,
            bold && `text__bold`, italic && `text__italic`, boldItalic && `text__bold-italic`, className)} {...props} />;
    },
);
