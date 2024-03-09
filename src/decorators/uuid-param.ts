import { Param, ParseUUIDPipe, PipeTransform, Type } from '@nestjs/common';

export const UUIDParam = (
  name: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) => Param(name, new ParseUUIDPipe({ version: '4' }), ...pipes);
