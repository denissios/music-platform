import React, {FC} from 'react';
import cl from './TrackPicture.module.css';
import MusicNoteIcon from "@mui/icons-material/MusicNote";

interface TrackPictureProps extends React.HTMLAttributes<HTMLElement> {
    isShowPicture: boolean,
    image: string | null,
    size?: number
}

const TrackPicture: FC<TrackPictureProps> = ({isShowPicture, image, size = 45, className, ...props}) => {
    const classes = [cl.emptyPicture, className].join(' ');

    return (
        <div className={classes} style={{width: size, height: size}} {...props}>
            {isShowPicture && image
                ?   <img className={cl.trackImage} src={`data:image/jpeg;base64,${image}`} alt='Picture'/>
                :   <MusicNoteIcon className={cl.emptyIconTrack}/>
            }
        </div>
    );
};

export default TrackPicture;