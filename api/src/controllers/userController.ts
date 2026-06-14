import type { Request, Response } from 'express';
import { mockUsers, getUserById } from '../repositories/mockData.ts';

export const loginHandler = (req: Request, res: Response) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: '请选择用户',
      data: null,
    });
  }
  
  const user = getUserById(userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户不存在',
      data: null,
    });
  }
  
  res.json({
    success: true,
    message: '登录成功',
    data: user,
  });
};

export const getUsersHandler = (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: '获取成功',
    data: mockUsers,
  });
};

export const getCurrentUserHandler = (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  
  if (userId && userId !== 'visitor') {
    const user = getUserById(userId);
    if (user) {
      return res.json({
        success: true,
        message: '获取成功',
        data: user,
      });
    }
  }
  
  res.json({
    success: true,
    message: '访客',
    data: {
      id: 'visitor',
      name: '访客',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=visitor',
      type: 'visitor',
    },
  });
};
