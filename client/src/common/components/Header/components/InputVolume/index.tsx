import React, {ChangeEvent, FC} from 'react';
import cl from './InputVolume.module.css';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {useAppSelector} from "../../../../../store/redux";

interface InputVolumeProps extends React.HTMLAttributes<HTMLElement> {
    max: number,
    current: number
}

const InputVolume: FC<InputVolumeProps> = ({max, current, onChange, ...props}) => {
    const {volume} = useAppSelector(state => state.playerReducer);

    return (
        <div className={cl.inputRange}>
            <input className={cl.input} type='range' min={0} max={max} value={current} onChange={onChange} {...props}/>
            {!volume ? <VolumeMuteIcon className={cl.volumeIcon}/> :
                (volume <= 60 ? <VolumeDownIcon className={cl.volumeIcon}/> : <VolumeUpIcon className={cl.volumeIcon}/>)}
        </div>
    );
};

export default InputVolume;