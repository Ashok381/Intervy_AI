import { User } from "../model/user.js";
import { signupSchema } from "../Schemas/signUpSchema.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signInSchema } from "../Schemas/signInSchema.js";

const generateAccesTokenAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!(accessToken && refreshToken)) {
      throw new Apierror(500, "Unable to create authentication tokens. Please try again.");
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof Apierror) {
      throw error;
    }

    throw new Apierror(500, "Unable to create authentication tokens. Please try again.");
  }
};

const option = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
};

const buildValidationErrors = (error) => {
  const messages = error?.issues?.map((issue) => issue.message).filter(Boolean) ?? [];
  return messages.length ? messages : ["Please check the submitted details."];
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    signupSchema.parse(req.body);
  } catch (error) {
    throw new Apierror(400, "Please check your details.", buildValidationErrors(error));
  }

  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) {
    throw new Apierror(409, "An account with that username or email already exists.");
  }

  const userCreated = await User.create({ username, email, password });

  if (!userCreated) {
    throw new Apierror(500, "Unable to create your account right now.");
  }

  return res.status(201).json(new Apiresponse(201, "Account created successfully.", userCreated));
});

const loginUser = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const identifier = username || email;

  try {
    signInSchema.parse({ identifier, password });
  } catch (error) {
    throw new Apierror(400, "Please enter a valid username or email and password.", buildValidationErrors(error));
  }

  const query = [];

  if (username) {
    query.push({ username });
  }

  if (email) {
    query.push({ email });
  }

  const user = await User.findOne({ $or: query });

  if (!user) {
    throw new Apierror(400, "No account found for that username or email.");
  }

  if (!(await user.isPasswordCorrect(password))) {
    throw new Apierror(400, "Invalid email or password.");
  }

  const { accessToken, refreshToken } = await generateAccesTokenAndRefreshToken(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new Apiresponse(200, "User logged in successfully.", [{ user, accessToken, refreshToken }]));
});

const logOutUser = asyncHandler(async (req, res) => {
  if (req.user == null) {
    throw new Apierror(401, "Please sign in again to continue.");
  }

  const loggedUser = await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: null } }, { new: true });

  if (!loggedUser) {
    throw new Apierror(404, "User not found.");
  }

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new Apiresponse(200, "User logged out successfully.", loggedUser));
});

const getUserInfo = asyncHandler(async (req, res) => {
  if (!req.refreshToken) {
    throw new Apierror(401, "Your session has expired. Please sign in again.");
  }

  if (req.user == null) {
    const user = await User.findById(req.id);

    if (!user || user.refreshToken !== req.refreshToken) {
      throw new Apierror(401, "Unauthorized.");
    }

    const { accessToken, refreshToken } = await generateAccesTokenAndRefreshToken(user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(new Apiresponse(200, "Account details fetched successfully.", user));
  }

  return res.status(200).json(new Apiresponse(200, "Account details fetched successfully.", req.user));
});

export { registerUser, loginUser, logOutUser, getUserInfo };
