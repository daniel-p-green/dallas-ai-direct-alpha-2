export function ComfortDots({ level }: { level: number }) {
  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`AI comfort level ${level} of 5`}
    >
      {[1, 2, 3, 4, 5].map((v) => (
        <span
          key={v}
          className="comfort-bar-segment"
          data-active={String(v <= level)}
          style={{ width: 6, height: 14, borderRadius: 2 }}
        />
      ))}
      <span className="ml-1.5 font-mono text-xs text-muted-foreground">
        {level}
      </span>
    </span>
  )
}
