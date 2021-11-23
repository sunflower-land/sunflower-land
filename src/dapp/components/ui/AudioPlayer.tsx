import React, {useState,useRef, useEffect} from 'react'
import leftEdgeInner from '../../images/ui/panel/lt_box_9slice_lc.png'
import rightEdgeInner from '../../images/ui/panel/lt_box_9slice_rc.png'
import bottomEdgeInner from '../../images/ui/panel/lt_box_9slice_bc.png'
import topEdgeInner from '../../images/ui/panel/lt_box_9slice_tc.png'
import topLeftInner from '../../images/ui/panel/lt_box_9slice_tl.png'
import bottomLeftInner from '../../images/ui/panel/lt_box_9slice_bl.png'
import topRightInner from '../../images/ui/panel/lt_box_9slice_tr.png'
import bottomRightInner from '../../images/ui/panel/lt_box_9slice_br.png'
import play from '../../images/ui/audio-player/play.png'
import pause from '../../images/ui/audio-player/pause.png'
import next from '../../images/ui/audio-player/next.png'
import note from '../../images/ui/audio-player/note.png'
import {playlist} from '../../songs/playlist.ts'
import './AudioPlayer.css'

export const AudioPlayer: React.FC = () => {
    const [onHover, setOnHover] = useState(false);
    const [isPlaying, setIsPlaying] = useState<Boolean>(true)
    const [music, setMusic] = useState(0);
    const [volume, setVolume] = useState<number>(0.5);
    const file = useRef(null)

    const togglePlayStop = ( ) => {
        if (file.current?.paused) {
            file.current.play();
            setIsPlaying(true)
        } else {
            file.current?.pause();
            setIsPlaying(false)
        }
    }

    const handleNext = () => {
        if((music + 2 ) > playlist.length){
            setMusic(0)
        }else{
            setMusic(music + 1)
        }
    }

    useEffect(() => {
        if(file){
            file.current.volume = volume
        }
    }, [volume]);

    return (
        <div id="audio-player-container"
             onMouseEnter={ () => setOnHover(true)}
             onMouseLeave={()=> setOnHover(false)}
             style={{
                 left: onHover ? "8px":"-255px"
             }}
        >
            <img id="note" src={note} alt="musical note"
                 style={{
                     right: onHover ? "90px": "-90px",
                     opacity:onHover ? 0 : 1
                 }}
            />
            <audio ref={file} id='audio-player' loop controls autoPlay src={playlist[music].file} />
            <img id="panel-left-edge" src={leftEdgeInner} />
            <img id="panel-right-edge" src={rightEdgeInner} />
            <img id="panel-bottom-edge" src={bottomEdgeInner} />
            <img id="panel-top-edge" src={topEdgeInner} />
            <img id="panel-top-left" src={topLeftInner} />
            <img id="panel-bottom-left" src={bottomLeftInner} />
            <img id="panel-bottom-right" src={bottomRightInner} />
            <img id="panel-top-right" src={topRightInner} />
            <div id="display-song">
                <div id="song-name">
                    {playlist[music].name + " - " + playlist[music].artist}
                </div>
            </div>
            <div id="controls">
                <img onClick={()=> togglePlayStop()} id="play-pause" src={isPlaying ? pause : play} alt=""/>
                <img onClick={()=> handleNext()} id="next" src={next} alt="next song"/>
                <input type="range" defaultValue={50} min={0} max={100} onChange={e=> setVolume(Number(e.target.value)/100)} id="volume" />
            </div>

        </div>
    )
}