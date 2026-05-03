import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'jaime@test.com',
    description: 'User email address',
  })
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  password!: string;
}
