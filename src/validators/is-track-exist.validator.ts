import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { TracksService } from 'src/tracks/tracks.service';
import { UUID } from 'src/types';

@ValidatorConstraint({ name: 'IsTrackExist', async: false })
@Injectable()
export class IsTrackExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly tracksService: TracksService) {}

  validate(value: UUID) {
    try {
      this.tracksService.findOne(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Track with id ${args.value} doesn't exist`;
  }
}

export function IsTrackExist(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsTrackExistValidator,
    });
  };
}
