/** Convert a 0-based row index to a letter: 0→A, 1→B, … */
export const rowLabel = (index: number) => String.fromCharCode(65 + index)
