import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {
  PauseIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'

const Player = () => {
  const spotifyApi = useSpotify()
  const [volume, setVolume] = useState(50)
  const { data: session, status } = useSession()
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)

  const songInfo: any = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data: any) => setCurrentTrackId(data?.body?.item.id))

      spotifyApi
        .getMyCurrentPlaybackState()
        .then((data: any) => setIsPlaying(data?.body?.is_playing))
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
      if (data.body.is_playing) {
        spotifyApi.pause().catch(() => console.log("You're not premium! 😢"))
        setIsPlaying(false)
      } else {
        spotifyApi.play().catch(() => console.log("You're not premium! 😢"))
        setIsPlaying(false)
      }
    })
  }

  const debounceAdjustVolumne = useCallback(
    debounce(
      (volume: number) =>
        spotifyApi
          .setVolume(volume)
          .catch(() => console.log("You're not premium! 😢")),
      500
    ),
    []
  )

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolumne(volume)
    }
  }, [volume])

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline-flex"
          src={songInfo?.album.images?.[0].url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          onClick={() => spotifyApi.skipToPrevious()}
        />

        {isPlaying ? (
          <PauseIcon className="button h-10 w-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="button h-10 w-10" onClick={handlePlayPause} />
        )}

        <FastForwardIcon
          className="button"
          onClick={() => spotifyApi.skipToNext()}
        />

        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          name=""
          id=""
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  )
}

export default Player
