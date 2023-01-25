interface Props {
  tags: string[]
}

export const TagBadges: React.FC<Props> = ({ tags }) => (
  <div className="flex gap-1">
    {tags.map((tag) => {
      return (
        <div className="badge-primary badge" key={tag}>
          {tag}
        </div>
      )
    })}
  </div>
)
