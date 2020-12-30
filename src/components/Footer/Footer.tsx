import React, { FC } from "react"

import {
  faFacebook,
  faSpotify,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "gatsby"

const Footer: FC = () => {
  return (
    <footer className="my-12 mx-auto flex flex-col">
      <div className="my-2">
        <a
          href="https://www.facebook.com/bailytroyer/"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon
            icon={faFacebook}
            size="lg"
            className="mx-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
          />
        </a>
        <a
          href="https://open.spotify.com/user/314lw74laovz3vlp2ydeamqidtnm?si=eiCcFFUzT_S0EmG36BoFMQ"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon
            icon={faSpotify}
            size="lg"
            className="mx-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
          />
        </a>
        <a
          href="https://www.linkedin.com/in/bailytroyer/"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon
            icon={faLinkedin}
            size="lg"
            className="mx-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
          />
        </a>
      </div>
    </footer>
  )
}

export default Footer
