import { IsEmail, IsString, Length, Matches } from 'class-validator';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;':",.<>/?])[^\r\n]{8,}$/;

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;

  @IsString()
  @Matches(PASSWORD_REGEX, { message: 'Password does not meet requirements' })
  newPassword: string;
}
