import { MarkdownInstance } from "astro"

//astroとReactコンポーネントで型を共有したいけどどうやるんだ
interface Frontmatter {
  title: string
  date?: string
  tags?: string[]
  draft?: boolean
  cover?: string
}

interface Props {
  articleData: MarkdownInstance<Frontmatter>
}

export const RecentCards: React.FC<Props> = ({ articleData }) => {
  const tagBadges = articleData.frontmatter.tags.map((tag) => {
    return <div className="badge-primary badge">{tag}</div>
  })

  return (
    <div className="mb-4 h-56 sm:h-64 xl:h-80 2xl:h-96" key={articleData.url}>
      <a href={articleData.url}>
        <div className="card card-side rounded-none bg-base-200 shadow-lg shadow-primary md:rounded-lg">
          <figure>
            <img
              src={articleData.frontmatter.cover}
              alt="Top Article Cover"
              className="min-h-56 max-h-56 sm:max-h-64 xl:max-h-80 2xl:max-h-96"
            />
          </figure>
          <div className="card-body items-center justify-center p-4">
            <h2 className="card-title text-primary-content">
              {articleData.frontmatter.title}
            </h2>
            <div className="flex flex-row gap-x-2">{tagBadges}</div>
          </div>
        </div>
      </a>
    </div>
  )
}
