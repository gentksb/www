import "@splidejs/react-splide/css"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import { MarkdownInstance } from "astro"
import { Frontmatter } from "./frontmatter"

interface Props {
  newBookPages: MarkdownInstance<Frontmatter>[]
}

export const BookList: React.FC<Props> = ({ newBookPages: newBookPages }) => {
  const bookSlides = newBookPages.map((newBookPage) => (
    <SplideSlide>
      <div>
        <a href={newBookPage.url}>
          <img src={newBookPage.frontmatter.cover} alt="Bookcover" />
        </a>
        <figcaption className="text-md absolute bottom-0 h-1/4 w-full bg-primary/75 px-4 text-base-100 md:text-xl">
          {newBookPage.frontmatter.title}
        </figcaption>
      </div>
    </SplideSlide>
  ))

  return (
    <div>
      <Splide
        aria-label="お気に入りの写真"
        options={{
          tag: "section",
          perPage: 4,
          breakpoints: {
            // Tailwind CSSと逆でBreakPoint以下の指定数値
            768: {
              perPage: 2
            }
          },
          gap: "0.5rem"
        }}
      >
        {bookSlides}
      </Splide>
    </div>
  )
}
