import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
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

  @ApiPropertyOptional({
    example: 'Jaime',
    description: 'Optional display name',
  })
  name?: string;
}
