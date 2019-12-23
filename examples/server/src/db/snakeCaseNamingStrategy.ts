import {DefaultNamingStrategy} from 'typeorm';

/**
 * Converts string into snake-case.
 *
 * @see https://regex101.com/r/QeSm2I/1
 */
function snakeCase(str: string) {
  return str.replace(/(?:([a-z])([A-Z]))|(?:((?!^)[A-Z])([a-z]))/g, '$1_$3$2$4').toLowerCase();
}

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy {

  tableName(targetName: string, userSpecifiedName: string) {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: any) {
    return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join('_'));
  }

  columnNameCustomized(customName: string) {
    return customName;
  }

  relationName(propertyName: string) {
    return snakeCase(propertyName);
  }
}
