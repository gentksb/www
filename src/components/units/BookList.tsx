import "@splidejs/react-splide/css"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import type { CollectionEntry } from "astro:content"

interface Props {
  newBookPages: CollectionEntry<"portfolio">[]
}

export const BookList: React.FC<Props> = ({ newBookPages }) => {
  const bookSlides = newBookPages.map((newBookPage) => (
    <SplideSlide key={newBookPage.id}>
      <div>
        <a href={`/${newBookPage.slug}/`}>
          <img src={newBookPage.data.cover} alt="Bookcover" />
        </a>
        <figcaption className="text-md absolute bottom-0 h-1/4 w-full bg-primary/75 px-4 text-base-100 md:text-xl">
          {newBookPage.data.title}
        </figcaption>
      </div>
    </SplideSlide>
  ))

  return (
    <div>
      <Splide
        aria-label="お気に入りの写真"
        options={{
          type: "loop",
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
