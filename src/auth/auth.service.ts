import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.userModel.findOne({
            $or: [{ username: dto.username }, { email: dto.email }],
        });
        if (existingUser) {
            throw new UnauthorizedException('Username or email already exists');
        }
        
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = new this.userModel({
            username: dto.username,
            email: dto.email,
            password: hashed,
        });
        return user.save();
    }

    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({
            $or: [
                { username: dto.usernameOrEmail },
                { email: dto.usernameOrEmail },
            ],
        });

        console.log('Login attempt:', dto);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        // console.log('Password match:', passwordMatch);

        if (!passwordMatch) {
            throw new UnauthorizedException('Incorrect password');
        }

        const token = this.jwtService.sign(
            { userId: user._id },
            { secret: process.env.JWT_SECRET, expiresIn: '1d' },
          );

        // console.log('Generated token:', token);
        return { token };
    }

    async validateUser(userId: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new UnauthorizedException('User not found');
        return user;
    }

    async verifyToken(token: string): Promise<UserDocument> {
        try {
            console.log('Verifying token:', token);

            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });

            console.log('Decoded JWT:', decoded);

            const user = await this.userModel.findById(decoded.userId);
            if (!user) throw new UnauthorizedException('User not found');
            return user;
        } catch (error) {
            console.log('JWT Verification Failed:', error.message);
            throw new UnauthorizedException('Access token is invalid or expired.');
        }
    }
      
}
