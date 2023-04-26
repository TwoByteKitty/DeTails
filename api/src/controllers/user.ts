import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { IUser, User } from "../models/user";
import { TOKEN_KEY } from "../utils/constants";

const registerUser = async (
  request: Request<{}, {}, IUser>,
  response: Response
) => {
  const user: IUser = request.body;
  const oldUser = await User.findOne({ userName: user.userName });

  if (oldUser) {
    return response.status(409).json({ 
      message: "User already exists. Please log in.",
      type: "AUTH",
    });
  }

  user.password = await bcrypt.hash(user.password, 10);

  User.create(user)
    .then((createdUser: IUser) => {
      const token = jwt.sign(
        { user_id: user._id },
        process.env.JWT_SECRET as Secret,
        {
          expiresIn: "2h",
        }
      );
      response.status(200).json({ userName: createdUser.userName });
    })
    .catch((err: any) => response.status(500).json(err));
};

const login = async (request: Request<{}, {}, IUser>, response: Response) => {
  const { userName, password } = request.body;

  User.findOne({ userName }).then(async (user) => {
    if (!user) {
      return response
        .status(401)
        .json({ type: "AUTH", message: "Username or password is incorrect." });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return response
        .status(401)
        .json({ type: "AUTH", message: "Username or password is incorrect." });
    }

    const token = jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: "2h",
      }
    );

    response
      .setHeader(TOKEN_KEY, token)
      .status(200)
      .json({ user: user.userName });
  });
};

const logout = (request: Request<{}, {}, {}>, response: Response) => {
  // request.logout({}, () => {
  //   response.status(200).send('Logged Out');
  // });
};

export { registerUser, login };
