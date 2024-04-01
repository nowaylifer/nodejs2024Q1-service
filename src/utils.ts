import Joi from 'joi';
import { logLevels } from './constants';

export const capitalize = <T extends string>(s: T) =>
  (s[0].toLocaleUpperCase() + s.slice(1)) as Capitalize<T>;

export const validateLogLevelsEnvVar: Joi.CustomValidator = (val, helper) => {
  const error = () =>
    helper.error('LOG_LEVELS must be an array of LogLevel strings');

  let arr: unknown;

  try {
    arr = JSON.parse(val);
  } catch {
    return error();
  }

  if (!Array.isArray(arr)) {
    return error();
  }

  if (!arr.every((val) => logLevels.includes(val))) {
    return error();
  }

  return arr;
};
