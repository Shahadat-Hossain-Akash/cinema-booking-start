const Legend = () => {
  const legends = [
    { label: 'Available', color: '#c8c8c8' },
    { label: 'Hold by me', color: '#4DC80B' },
    { label: 'Others hold', color: '#F2C01E' },
    { label: 'Booked', color: '#EE1F1F' },
  ]
  return (
    <div className="legend">
      {legends.map((legend) => (
        <div key={legend.label} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full shrink-0`}
            style={{ backgroundColor: legend.color }}
          ></div>
          <span>{legend.label}</span>
        </div>
      ))}
    </div>
  )
}

export default Legend
