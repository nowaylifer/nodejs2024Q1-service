import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { AlbumsService } from 'src/albums/albums.service';
import { UUID } from 'src/types';

@ValidatorConstraint({ name: 'IsAlbumExist', async: false })
@Injectable()
export class IsAlbumExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly albumsService: AlbumsService) {}

  validate(value: UUID) {
    try {
      this.albumsService.findOne(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Album with id ${args.value} doesn't exist`;
  }
}

export function IsAlbumExist(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsAlbumExistValidator,
    });
  };
}
