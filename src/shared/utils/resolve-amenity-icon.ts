import {
  findIconDefinition,
  type IconDefinition,
  type IconName,
} from '@fortawesome/fontawesome-svg-core';

function toCamelCaseIconName(iconName: string): string {
  return iconName.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export function resolveAmenityIcon(iconName: string): IconDefinition {
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

  return findIconDefinition({ prefix: 'fas', iconName: 'circle' })!;
}
