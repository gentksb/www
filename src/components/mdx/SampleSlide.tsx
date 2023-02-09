import "@splidejs/react-splide/css"
import { Splide, SplideSlide } from "@splidejs/react-splide"

interface Props {
  sampleImageUrls: string[]
}

export const MdxSampleSlide: React.FC<Props> = ({ sampleImageUrls }) => {
  const sampleSlides = sampleImageUrls.map((imageUrl, index) => (
    <SplideSlide>
      <img src={imageUrl} alt={`sample${index + 1}`} className="mx-auto" />
    </SplideSlide>
  ))

  return (
    <div>
      <Splide
        aria-label="同人誌サンプル"
        options={{
          type: "loop",
          tag: "section",
          perPage: 1,
          gap: "0.5rem",
          breakpoints: {
            // Tailwind CSSと逆でBreakPoint以下の指定数値
            768: {
              perPage: 1
            }
          }
        }}
      >
        {sampleSlides}
      </Splide>
    </div>
  )
}
