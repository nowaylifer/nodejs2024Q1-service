import { UUID } from 'src/types';

export interface TokenPayload {
  userId: UUID;
  login: string;
}
