import React from "react"
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa"

const Socials: React.FC = () => (
  <div>
    <div className="flex space-x-4 justify-end items-center">
      <img
        src="/images/logo.jpg"
        alt="avatar"
        className="rounded-full w-16 h-16"
      />
      <a href="https://github.com/gentksb">
        <FaGithub className="w-8 h-8" />
      </a>

      <a href="https://twitter.com/gen_sobunya">
        <FaTwitter className="w-8 h-8" />
      </a>
      <a href="https://instagram.com/gen_sobunya">
        <FaInstagram className="w-8 h-8" />
      </a>
    </div>
  </div>
)

export default Socials
