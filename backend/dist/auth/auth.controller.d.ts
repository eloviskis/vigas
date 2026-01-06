import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    test(): {
        message: string;
        time: string;
    };
    login(body: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            role: string;
            nome: string;
        };
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
