export function ComfortDots({ level }: { level: number }) {
  return (
    <span
      className="inline-flex w-20 items-center gap-0.5"
      aria-label={`AI comfort level ${level} of 5`}
    >
      {[1, 2, 3, 4, 5].map((v) => (
        <span
          key={v}
          className={`comfort-segment ${
            v <= level
              ? "bg-primary"
              : "bg-muted"
          }`}
        />
      ))}
    </span>
  )
}
