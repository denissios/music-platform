import React, {FC} from 'react';
import cl from './TrackProgress.module.css';

interface TrackProgressProps extends React.HTMLAttributes<HTMLElement> {
    max: number,
    current: number
}

const TrackProgress: FC<TrackProgressProps> = ({max, current, onChange, className, ...props}) => {
    return (
        <div className={[cl.trackProgress, className].join(' ')}>
            <input {...props} type='range' min={0} max={max} value={current} onChange={onChange} {...props}/>
        </div>
    );
};

export default TrackProgress;