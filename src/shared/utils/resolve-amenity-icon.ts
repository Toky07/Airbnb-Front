import {
  findIconDefinition,
  library,
  type IconDefinition,
  type IconName,
} from '@fortawesome/fontawesome-svg-core';
import { faCircle, fas } from '@fortawesome/free-solid-svg-icons';

let iconsRegistered = false;

function ensureIconsRegistered(): void {
  if (!iconsRegistered) {
    library.add(fas);
    iconsRegistered = true;
  }
}

function toCamelCaseIconName(iconName: string): string {
  return iconName.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export function resolveAmenityIcon(iconName: string): IconDefinition {
  ensureIconsRegistered();

  const candidates = [iconName.trim(), toCamelCaseIconName(iconName.trim())];

  for (const candidate of candidates) {
    const definition = findIconDefinition({
      prefix: 'fas',
      iconName: candidate as IconName,
    });
    if (definition) {
      return definition;
    }
  }

  return faCircle;
}
