import "@splidejs/react-splide/css"
import { Splide, SplideSlide } from "@splidejs/react-splide"

export const BookList: React.FC = () => {
  return (
    <>
      <Splide
        aria-label="お気に入りの写真"
        options={{
          tag: "section",
          perPage: 4,
          breakpoints: {
            768: {
              perPage: 2
            }
          },
          gap: "0.5rem"
        }}
      >
        <SplideSlide>
          <img src="/images/c101/c101_cover.png" alt="Image 1" />
        </SplideSlide>
        <SplideSlide>
          <img src="/images/c100/c100cover.png" alt="Image 2" />
        </SplideSlide>
        <SplideSlide>
          <img src="/images/c99/c99cover.png" alt="Image 2" />
        </SplideSlide>
        <SplideSlide>
          <img src="/images/c97/c97cover.jpg" alt="Image 2" />
        </SplideSlide>
        <SplideSlide>
          <img src="/images/c95/deirin_senden.jpg" alt="Image 2" />
        </SplideSlide>
      </Splide>
    </>
  )
}
