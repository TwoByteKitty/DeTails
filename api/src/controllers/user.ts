import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { IUser, User } from '../models/user';

const registerUser = (request: Request<{}, {}, IUser>, response: Response, next: NextFunction) => {
  const user: IUser = request.body;

  bcrypt.genSalt(10, (err: any, salt: string) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      User.create(user)
        .then((createdUser: IUser) => response.json({ userName: createdUser.userName }))
        .catch((err: any) => response.status(500).json(err));
    });
  });
};

const login = (request: Request<{}, {}, IUser>, response: Response) => {
  const { userName, password } = request.body;

  User.findOne({ userName }).then((user) => {
    if (!user) {
      return response.status(500).send('Server Error');
    }

    if (!user.comparePassword(password)) {
      return response.status(401).send('Unauthorized');
    }

    response.json({
      token: jwt.sign({ sub: user._id }, process.env.JWT_SECRET as Secret),
      userName: user.userName,
    });
  });
};

const logout = (request: Request<{}, {}, {}>, response: Response) => {
  request.logout({}, () => {
    response.status(200).send('Logged Out');
  });
};

export { registerUser, login, logout };
