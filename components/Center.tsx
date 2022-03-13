import { signOut, useSession } from 'next-auth/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { shuffle } from 'lodash'
import { useEffect, useState } from 'react'
import { playlistState, playlistIdState } from '../atoms/playlistAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-cyan-500',
  'from-pink-500',
  'from-purple-500',
]

const Center = () => {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const [color, setColor] = useState('')
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState<any>(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop() as string)
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data: any) => {
        setPlaylist(data.body)
      })
      .catch((error) => {
        console.log('Something went wrong!', error)
      })
  }, [spotifyApi, playlistId])

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="cursor-point flex cursor-pointer items-center space-x-3 rounded-full bg-black p-2 pr-3 text-white opacity-90 hover:opacity-80"
          onClick={() => signOut()}
        >
          <img
            className="h-10 rounded-full"
            src={session?.user?.image as string}
            alt=""
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p className="uppercase">Playlist</p>
          <h2 className="text-2xl font-bold md:text-3xl xl:text-4xl">
            {playlist?.name}
          </h2>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
