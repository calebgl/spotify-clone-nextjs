import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify'
import { ConvertMsToMinutesSeconds } from '../lib/time'

interface Song {
  order: any
  track: any
}

const Song = ({ order, track }: Song) => {
  const {
    id,
    artists,
    duration_ms,
    uri,
    name: trackName,
    album: { images, name: albumName },
  } = track

  const spotifyApi = useSpotify()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const playSong = () => {
    setCurrentTrackId(id)
    setIsPlaying(true)
    spotifyApi
      .play({
        uris: [uri],
      })
      .catch(() => console.log("You're not premium! 😢"))
  }

  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-10 w-10" src={images[0].url} alt="" />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{trackName}</p>
          <p className="w-40">{artists[0].name}</p>
        </div>
      </div>
      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline-flex">{albumName}</p>
        <p>{ConvertMsToMinutesSeconds(duration_ms)}</p>
      </div>
    </div>
  )
}

export default Song
