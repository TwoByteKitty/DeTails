import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { IUser, User } from '../models/user';

const registerUser = async (request: Request<{}, {}, IUser>, response: Response, next: NextFunction) => {
  const user: IUser = request.body;
  const oldUser = await User.findOne({ userName: user.userName });

  if (oldUser) {
    return response.status(409).send('User Already Exist. Please Login');
  }

  user.password = await bcrypt.hash(user.password, 10);

  User.create(user)
    .then((createdUser: IUser) => {
      const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET as Secret, {
        expiresIn: '2h',
      });
      // save user token
      createdUser.token = token;
      // return new user
      response.status(201).json({ userName: createdUser.userName, token: createdUser.token });
    })
    .catch((err: any) => response.status(500).json(err));
};

const login = async (request: Request<{}, {}, IUser>, response: Response) => {
  const { userName, password } = request.body;

  User.findOne({ userName }).then(async (user) => {
    if (!user) {
      return response.status(500).send('Server Error');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return response.status(401).send('Unauthorized');
    }

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET as Secret, {
      expiresIn: '2h',
    });

    // save user token
    user.token = token;
    // user
    response.status(200).json({ userName: user.userName, token: user.token });
  });
};

const logout = (request: Request<{}, {}, {}>, response: Response) => {
  // request.logout({}, () => {
  //   response.status(200).send('Logged Out');
  // });
};

export { registerUser, login, logout };
