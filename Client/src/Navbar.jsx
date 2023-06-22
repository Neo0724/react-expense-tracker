import { useNavigate } from 'react-router'
import { useCookies } from 'react-cookie'
import NavbarComponent from "./Component/NavbarComponent"
import { useGlobalContext } from './Context/GlobalContextProvider'
import loginIcon from '/login.png'
import signoutIcon from "/signout.png"

export default function Navbar() {
    const [ cookies, setCookies ] = useCookies(["access_token"]) 

    const navigate = useNavigate()

    const { navbar, setNavbar } = useGlobalContext()

    const username = localStorage.getItem("Username")

    const style = {
      marginLeft: username ? "" : "auto",
      marginRight: username ? "" : "auto"
    }

    const removeNavbarItem = async () => {
      return new Promise((resolve, reject) => {
        const defaultNavbar = navbar.map(item => {
          return {...item, active: false}
        })

        setNavbar(defaultNavbar)

        resolve(defaultNavbar)
      })
    }

    const handleSignOut = async () => {
        if (!username) return
        await removeNavbarItem()
        setCookies("access_token", "")
        localStorage.clear()
        navigate("intermediateExpenseTrackerFrontend/login")
    }

    const handleLogin = () => {
      if (username) return
      navigate("intermediateExpenseTrackerFrontend/login")
    }

  return (
    <div className="navbarContainer">
        <div className="loginNavbarContainer">
            <img className="login" style={style} src={loginIcon} alt="loginIcon" onClick={handleLogin}></img>
            {username ? <div className='userName'>{username}</div> : null}
        </div>
        {navbar.map(item => {
          let randomID = crypto.randomUUID()
          return <NavbarComponent id={item.id} name={item.name} icon={item.icon} active={item.active} setNavbar={setNavbar} key={randomID}/>
        })}
        { username ? <img className="signOut" src={signoutIcon} alt='signoutIcon' onClick={handleSignOut}></img> : null }
    </div>
  )
}
