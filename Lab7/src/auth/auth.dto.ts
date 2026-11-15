import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// Mirrors the Signup modal: name, email, password (min 6)
export class SignupDto {
  @IsString() @IsNotEmpty() @MaxLength(80)
  name: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(6)
  password: string;
}

// Mirrors the Login modal
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString() @IsNotEmpty()
  password: string;
}
