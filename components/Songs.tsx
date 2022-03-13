import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song'

const Songs = () => {
  const playlist = useRecoilValue<any>(playlistState)

  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {playlist?.tracks.items.map((track: any, index: number) => (
        <Song key={track.track.id} track={track.track} order={index} />
      ))}
    </div>
  )
}

export default Songs
