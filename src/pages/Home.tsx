import { DarkModeButton } from '../components/DarkModeButton'
import { SideBar } from '../components/SideBar'

export const Home = () => {
  return (
    <>
      <div className="flex flex-row justify-between m-4">
        <SideBar />
      </div>
      <div className="flex justify-center items-center">
        <h1 className="text-4xl">Welcome to your notes home</h1>
      </div>
    </>
  )
}
