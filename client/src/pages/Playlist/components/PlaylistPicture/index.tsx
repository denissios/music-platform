import React, {FC} from 'react';
import cl from './PlaylistPicture.module.css';
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

interface PlaylistPictureProps extends React.HTMLAttributes<HTMLElement> {
    isShowPicture: boolean,
    image: string | null,
    size?: number
}

const PlaylistPicture: FC<PlaylistPictureProps> = ({isShowPicture, image, size = 45, className, ...props}) => {
    const classes = [cl.emptyPicture, className].join(' ');

    return (
        <div className={classes} style={{width: size, height: size}} {...props}>
            {isShowPicture && image
                ?   <img className={cl.trackImage} src={image} alt='Picture'/>
                :   <QueueMusicIcon className={cl.emptyIconTrack}/>
            }
        </div>
    );
};

export default PlaylistPicture;