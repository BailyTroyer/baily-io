import React, { FC } from "react"

import {
  faFacebook,
  faSpotify,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Footer: FC = () => {
  return (
    <footer className="my-12 mx-auto flex flex-col">
      <div className="my-2">
        <FontAwesomeIcon
          icon={faFacebook}
          size="lg"
          className="mx-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
        />
        <FontAwesomeIcon
          icon={faSpotify}
          size="lg"
          className="mx-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
        />
        <FontAwesomeIcon
          icon={faLinkedin}
          size="lg"
          className="mx-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
        />
      </div>
    </footer>
  )
}

export default Footer
