export function ComfortDots({ level }: { level: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={`AI comfort level ${level} of 5`}
    >
      {[1, 2, 3, 4, 5].map((v) => (
        <span
          key={v}
          className="comfort-dot"
          data-active={String(v <= level)}
          data-level={String(v)}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-muted-foreground">
        {level}
      </span>
    </span>
  )
}
