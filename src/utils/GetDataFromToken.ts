import { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

export const getDataFromToken = (request: NextRequest): string | null => {
    try {
        const token = request.cookies.get("token")?.value || "";

        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN!) as CustomJwtPayload;

        return decodedToken.id;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};
