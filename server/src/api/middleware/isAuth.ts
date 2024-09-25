import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {IUser} from "../../db/models/User";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token!, process.env.JWT_SECRET!);

        if (decoded) {
            (req as any).user = decoded as IUser;
            next();
        }
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
