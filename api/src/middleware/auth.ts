import type { Request, Response, NextFunction } from 'express';
import { mockUsers } from '../repositories/mockData.ts';

declare global {
  namespace Express {
    interface Request {
      user?: typeof mockUsers[0];
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  
  if (userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      req.user = user;
      return next();
    }
  }
  
  req.user = {
    id: 'visitor',
    name: '访客',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=visitor',
    type: 'visitor',
  };
  
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.type === 'visitor') {
    return res.status(401).json({
      success: false,
      message: '请先登录',
      data: null,
    });
  }
  next();
};

export const requireMaintainer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.type !== 'maintainer') {
    return res.status(403).json({
      success: false,
      message: '需要维护者权限',
      data: null,
    });
  }
  next();
};
