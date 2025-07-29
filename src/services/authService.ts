import User, { IUser } from '../models/User';
import { RegisterRequest, LoginRequest, AuthResponse, JWTPayload } from '../types/auth';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middlewares/errorMiddleware';

class AuthService {
  // Register a new user
  async registerUser(userData: RegisterRequest): Promise<AuthResponse> {
    const { username, email, name, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      throw new AppError(`${field} already exists`, 400);
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      name,
      password,
    });

    // Generate JWT token
    const tokenPayload: JWTPayload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    const token = generateToken(tokenPayload);

    // Return user data and token
    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  // Login user
  async loginUser(loginData: LoginRequest): Promise<AuthResponse> {
    const { username, password } = loginData;

    // Find user by username or email and include password
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select('+password');

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT token
    const tokenPayload: JWTPayload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    const token = generateToken(tokenPayload);

    // Return user data and token
    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  // Get user by ID
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password');
  }

  // Get user profile (authenticated)
  async getUserProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

export default new AuthService();