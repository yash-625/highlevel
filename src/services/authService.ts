import User, { IUser } from '../models/User';
import Organization from '../models/Organization';
import { RegisterRequest, LoginRequest, AuthResponse, JWTPayload } from '../types/auth';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middlewares/errorMiddleware';
import mongoose from 'mongoose';

class AuthService {
  /**
   * Register a new user with organization
   */
  async registerUser(userData: RegisterRequest): Promise<AuthResponse> {
    // const session = await mongoose.startSession();
    
    try {
      // const result = await session.withTransaction(async () => {
        const { username, email, name, password, organizationName } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email }, { username }],
        });

        if (existingUser) {
          const field = existingUser.email === email ? 'Email' : 'Username';
          throw new AppError(`${field} already exists`, 400);
        }

        // Find existing organization or create if it does not exist
        let organization = await Organization.findOne({ name: organizationName.trim() });
        if (!organization) {
          organization = await Organization.create({
            name: organizationName.trim(),
            status: 'active'
          });
        }

        if (!organization) {
          throw new AppError('Failed to create organization', 500);
        }

        // Create new user with organizationId
        const user = await User.create([{
          username,
          email,
          name,
          password,
          organizationId: organization?._id,
          isActive: true
        }]);

        if (!user || user.length === 0) {
          throw new AppError('Failed to create user', 500);
        }

        const result =  { user: user[0] as any, organization: organization as any };
      // });

      // Generate JWT token with organizationId
      const tokenPayload: JWTPayload = {
        userId: (result.user as any)._id.toString(),
        organizationId: (result.organization as any)._id.toString(),
        username: (result.user as any).username,
        email: (result.user as any).email,
        isActive: (result.user as any).isActive
      };

      const token = generateToken(tokenPayload);

      // Return user data and token
      return {
        user: {
          id: (result.user as any)._id.toString(),
          username: (result.user as any).username,
          email: (result.user as any).email,
          name: (result.user as any).name,
          organizationId: (result.organization as any)._id.toString(),
          organizationName: (result.organization as any).name,
          isActive: (result.user as any).isActive,
          createdAt: (result.user as any).createdAt,
        },
        token,
      };

    } finally {
      // await session.endSession();
    }
  }

  /**
   * Login user with organization data
   */
  async loginUser(loginData: LoginRequest): Promise<AuthResponse> {
    const { username, password } = loginData;

    // Find user by username or email and include password + organization
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    })
    .populate('organizationId', 'name status')
    .select('+password');

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    // Check organization status
    const organization = user.organizationId as any;
    if (!organization || organization.status !== 'active') {
      throw new AppError('Organization is not active', 403);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT token with organizationId
    const tokenPayload: JWTPayload = {
      userId: user._id.toString(),
      organizationId: organization._id.toString(),
      username: user.username,
      email: user.email,
      isActive: user.isActive
    };

    const token = generateToken(tokenPayload);

    // Return user data and token
    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        organizationId: organization._id.toString(),
        organizationName: organization.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Get user profile with organization
   */
  async getUserProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId)
      .populate('organizationId', 'name status')
      .select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

export default new AuthService();