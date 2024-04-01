import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { ArtistsService } from 'src/artists/artists.service';
import { UUID } from 'src/types';

@ValidatorConstraint({ name: 'IsArtistExist', async: false })
@Injectable()
export class IsArtistExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly artistsService: ArtistsService) {}

  validate(value: UUID) {
    try {
      this.artistsService.findOne(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Artist with id "${args.value}" doesn't exist`;
  }
}

export function IsArtistExist(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsArtistExistValidator,
    });
  };
}
