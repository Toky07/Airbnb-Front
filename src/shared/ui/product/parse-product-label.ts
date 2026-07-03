export function parseProductLabel(label: string): {
  roomName: string;
  propertyName: string;
} {
  const parts = label.split('·').map((part) => part.trim());
  if (parts.length >= 2) {
    return {
      roomName: parts[0]!,
      propertyName: parts.slice(1).join(' · '),
    };
  }

  return {
    roomName: label,
    propertyName: 'Établissement',
  };
}
