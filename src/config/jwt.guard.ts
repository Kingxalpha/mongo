import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['token'];

        if (!token) {
            throw new UnauthorizedException('Access token is missing.');
        }

        try {
            const user = await this.authService.verifyToken(token);
            if (!user) {
                throw new UnauthorizedException('Access token is invalid or expired.');
            }
            request['userId'] = user // Assuming user has an _id field
            return true;
        } catch (err) {
            throw new UnauthorizedException('Access token is invalid or expired.');
        }
    }
}
  