function Screen() {
  return (
    <div className="m-10 flex flex-col items-center">
      <div
        className="h-3 w-3/4 min-w-lg rounded-t-2xl"
        style={{
          background:
            'linear-gradient(180deg, oklch(56.72% 0.000 0) 0%, oklch(56.72% 0.000 0) 100%)',
          boxShadow: '0 0 60px oklch(22.21% 0.000 0)',
        }}
        aria-hidden
      />
      <div
        className="h-16 w-3/4 min-w-lg"
        style={{
          background:
            'linear-gradient(180deg, oklch(56.72% 0.000 0 /0.25) 0%, transparent 100%)',
          clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)',
        }}
        aria-hidden
      />
      <p className="-mt-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Screen
      </p>
    </div>
  )
}

export default Screen
