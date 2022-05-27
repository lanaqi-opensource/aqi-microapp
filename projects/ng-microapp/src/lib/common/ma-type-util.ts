export class MaTypeUtil {

  private constructor() {
  }

  public static isUndefined(targetValue: any): boolean {
    return typeof targetValue === 'undefined';
  }

  public static nonUndefined(targetValue: any): boolean {
    return !MaTypeUtil.isUndefined(targetValue);
  }

  public static isNull(targetValue: any): boolean {
    return targetValue === null;
  }

  public static nonNull(targetValue: any): boolean {
    return !MaTypeUtil.isNull(targetValue);
  }

  public static isObject(targetValue: any): boolean {
    return typeof targetValue === 'object';
  }

  public static nonObject(targetValue: any): boolean {
    return !MaTypeUtil.isObject(targetValue);
  }

  public static isNumber(targetValue: any): boolean {
    return typeof targetValue === 'number';
  }

  public static nonNumber(targetValue: any): boolean {
    return !MaTypeUtil.isNumber(targetValue);
  }

  public static isBigint(targetValue: any): boolean {
    return typeof targetValue === 'bigint';
  }

  public static nonBigint(targetValue: any): boolean {
    return !MaTypeUtil.isBigint(targetValue);
  }

  public static isSymbol(targetValue: any): boolean {
    return typeof targetValue === 'symbol';
  }

  public static nonSymbol(targetValue: any): boolean {
    return !MaTypeUtil.isSymbol(targetValue);
  }

  public static isFunction(targetValue: any): boolean {
    return typeof targetValue === 'function';
  }

  public static nonFunction(targetValue: any): boolean {
    return !MaTypeUtil.isFunction(targetValue);
  }

  public static isBoolean(targetValue: any): boolean {
    return typeof targetValue === 'boolean';
  }

  public static nonBoolean(targetValue: any): boolean {
    return !MaTypeUtil.isBoolean(targetValue);
  }

  public static isString(targetValue: any): boolean {
    return typeof targetValue === 'string';
  }

  public static nonString(targetValue: any): boolean {
    return !MaTypeUtil.isString(targetValue);
  }

  public static isArray(targetValue: any): boolean {
    return Array.isArray(targetValue);
  }

  public static nonArray(targetValue: any): boolean {
    return !MaTypeUtil.isArray(targetValue);
  }

  public static isSafe(targetValue: any): boolean {
    return MaTypeUtil.nonUndefined(targetValue) && MaTypeUtil.nonNull(targetValue);
  }

  public static nonSafe(targetValue: any): boolean {
    return MaTypeUtil.isUndefined(targetValue) || MaTypeUtil.isNull(targetValue);
  }

  public static isEmptyString(targetValue: any): boolean {
    return MaTypeUtil.nonSafe(targetValue) || (MaTypeUtil.isString(targetValue) && (targetValue as string).trim() === '');
  }

  public static nonEmptyString(targetValue: any): boolean {
    return MaTypeUtil.isString(targetValue) && (targetValue as string).trim() !== '';
  }

  public static isEmptyArray(targetValue: any): boolean {
    return MaTypeUtil.nonSafe(targetValue) || (MaTypeUtil.isArray(targetValue) && (targetValue as []).length === 0);
  }

  public static nonEmptyArray(targetValue: any): boolean {
    return MaTypeUtil.isArray(targetValue) && (targetValue as []).length !== 0;
  }

}
