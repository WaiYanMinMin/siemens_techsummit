export type TrackNumber = 1 | 2 | 3;

export type TrackFilterValue = "" | `${TrackNumber}`;

const TRACK_NUMBER_RE = /^Track\s*([123])\b/i;

export function getTrackNumber(
  value: string | null | undefined,
): TrackNumber | null {
  if (!value?.trim()) {
    return null;
  }

  const match = value.trim().match(TRACK_NUMBER_RE);
  if (!match) {
    return null;
  }

  return Number(match[1]) as TrackNumber;
}

export function matchesTrackFilter(
  value: string | null | undefined,
  filter: TrackFilterValue,
): boolean {
  if (!filter) {
    return true;
  }

  return getTrackNumber(value) === Number(filter);
}

export const trackFilterOptions: { value: TrackFilterValue; label: string }[] = [
  { value: "", label: "All tracks" },
  { value: "1", label: "Track 1" },
  { value: "2", label: "Track 2" },
  { value: "3", label: "Track 3" },
];
