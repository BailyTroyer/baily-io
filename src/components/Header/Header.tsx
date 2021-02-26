import React, { FC } from "react"

import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "gatsby"
import tw from "twin.macro"

const NavLink = tw.h3`mx-3 text-gray-500 font-medium text-lg cursor-pointer hover:text-gray-900 transition duration-150 ease-in-out`

interface Props {
  siteTitle: string
}

const Header: FC<Props> = (props: Props) => {
  const { siteTitle } = props

  return (
    <header className="p-8 bg-gray-100">
      <nav className="flex items-center justify-between max-w-screen-lg mx-auto">
        <h1 className="font-extrabold text-gray-900 text-3xl">
          <Link to="/">{siteTitle}</Link>
        </h1>
        <div className="justify-center items-center flex flex-row">
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
