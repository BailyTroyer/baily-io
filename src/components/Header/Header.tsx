import React, { FC } from "react"

import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faHamburger, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "gatsby"
import tw from "twin.macro"

const NavLink = tw.h3`mx-5 text-gray-500 font-medium text-lg cursor-pointer hover:text-gray-900 transition duration-150 ease-in-out`
const HamburgerNavLink = tw.a`text-white my-8 text-4xl`

interface Props {
  siteTitle: string
}

const Header: FC<Props> = (props: Props) => {
  const { siteTitle } = props

  const [navVisible, setNavVisible] = React.useState(false)

  return (
    <header className="p-8 bg-gray-100">
      <nav className="flex items-center justify-between max-w-screen-lg mx-auto">
        <h1 className="font-extrabold text-gray-900 text-3xl">
          <Link to="/">{siteTitle}</Link>
        </h1>
        <FontAwesomeIcon
          icon={faHamburger}
          size="lg"
          className="md:hidden"
          onClick={() => setNavVisible(!navVisible)}
        />
        <div
          className={`${
            navVisible ? "fixed" : "hidden"
          } z-10 top-0 left-0 bg-black bg-opacity-95 w-full h-full`}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="absolute top-8 right-8 text-white"
            onClick={() => setNavVisible(!navVisible)}
          />
          <div className="absolute w-full text-center top-1/4 flex flex-col">
            <HamburgerNavLink>About</HamburgerNavLink>
            <HamburgerNavLink>Projects</HamburgerNavLink>
            <HamburgerNavLink>Contact</HamburgerNavLink>
          </div>
        </div>
        <div className="justify-center items-center hidden md:flex md:flex-row">
          <NavLink>About</NavLink>
          <NavLink>Projects</NavLink>
          <NavLink>Contact</NavLink>
          <a
            href="http://github.com/BailyTroyer"
            target="_blank"
            rel="noreferrer"
          >
            <NavLink>
              <FontAwesomeIcon icon={faGithub} size="lg" />
            </NavLink>
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Header
