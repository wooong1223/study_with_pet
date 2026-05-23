function hasFinalConsonant(text: string) {
  const lastChar = text.trim().at(-1);

  if (lastChar == null) {
    return false;
  }

  const code = lastChar.charCodeAt(0);
  const hangulStart = 0xac00;
  const hangulEnd = 0xd7a3;

  if (code < hangulStart || code > hangulEnd) {
    return false;
  }

  return (code - hangulStart) % 28 !== 0;
}

export function withSubjectParticle(text: string) {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return "친구가";
  }

  return `${trimmed}${hasFinalConsonant(trimmed) ? "이" : "가"}`;
}
