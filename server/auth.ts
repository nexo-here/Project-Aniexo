import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import { User, InsertUser } from '@shared/schema';

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'aniexo-secret-key';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
export const generateToken = (user: User): string => {
  return jwt.sign(
    { 
      id: user.id,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password with hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Authentication middleware
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;
    
    // Alternative: Get token from authorization header
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please login.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number, username: string };
    
    // Find user by id
    const user = await storage.getUser(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found. Please login again.'
      });
    }
    
    // Add user to request object
    (req as any).user = {
      id: user.id,
      username: user.username
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token. Please login again.'
    });
  }
};

// Registration handler
export const register = async (userData: InsertUser): Promise<{ user: User; token: string } | { error: string }> => {
  try {
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    
    if (existingUser) {
      return { error: 'Username already exists' };
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Create user
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword
    });
    
    // Generate token
    const token = generateToken(user);
    
    return { user, token };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register user' };
  }
};

// Login handler
export const login = async (username: string, password: string): Promise<{ user: User; token: string } | { error: string }> => {
  try {
    // Find user by username
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return { error: 'Invalid username or password' };
    }
    
    // Compare password
    const isMatch = await comparePassword(password, user.password);
    
    if (!isMatch) {
      return { error: 'Invalid username or password' };
    }
    
    // Generate token
    const token = generateToken(user);
    
    return { user, token };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Failed to login' };
  }
};