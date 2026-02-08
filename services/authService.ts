
import { User, AuthResponse } from '../types';

const USERS_DB_KEY = 'thinkpath_users_vault';
const RATE_LIMIT_KEY = 'thinkpath_auth_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 30000; // 30 seconds cooldown

/**
 * AuthService: Manages the lifecycle of user identity and security.
 * Implements a stateless JWT-based approach with client-side hashing simulation.
 */
class AuthService {
  /**
   * SECTION 5: Security Best Practices - Password Hashing
   * In a production environment, this would happen on a secure backend.
   * We simulate this using crypto.subtle to ensure no plain passwords touch local storage.
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    // A 'salt' is added to prevent rainbow table attacks.
    const data = encoder.encode(password + "thinkpath_security_salt_v1_2024");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * SECTION 4: Session Management - JWT Token Simulation
   * Generates a stateless token that identifies the user and their permissions.
   */
  private generateToken(user: any): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ 
      sub: user.id, 
      name: user.name, 
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24-hour expiration
    }));
    // In production, the signature would be a HMAC hash of (header + payload) using a secret key.
    return `${header}.${payload}.[SIGNATURE_VERIFIED]`;
  }

  private getRateLimit(): { count: number, lastAttempt: number } {
    const data = sessionStorage.getItem(RATE_LIMIT_KEY);
    return data ? JSON.parse(data) : { count: 0, lastAttempt: 0 };
  }

  private updateRateLimit(isFailure: boolean) {
    const limit = this.getRateLimit();
    if (isFailure) {
      limit.count += 1;
    } else {
      limit.count = 0;
    }
    limit.lastAttempt = Date.now();
    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limit));
  }

  /**
   * SECTION 2: Signup Flow
   * Establishes a new user identity in the vault.
   */
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const users = this.getUsers();
    
    // Check for email uniqueness (Section 2: Step 5)
    if (users.find(u => u.email === email.toLowerCase())) {
      return { error: "Security Alert: An account with this identity already exists." };
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      createdAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    const token = this.generateToken(newUser);
    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email, token }
    };
  }

  /**
   * SECTION 3: Login Flow
   * Verifies identity through hash comparison and issues a session token.
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const limit = this.getRateLimit();
    
    // SECTION 5: Brute Force Protection (Rate Limiting)
    if (limit.count >= MAX_ATTEMPTS && (Date.now() - limit.lastAttempt) < LOCKOUT_TIME) {
      return { 
        error: "Access Denied: Too many failed attempts. Identity verification locked for 30s.", 
        retryAfter: Math.ceil((LOCKOUT_TIME - (Date.now() - limit.lastAttempt)) / 1000) 
      };
    }

    const users = this.getUsers();
    const user = users.find(u => u.email === email.toLowerCase());
    const hashedPassword = await this.hashPassword(password);

    // SECTION 6: Sanitized Error Handling (Avoiding Security Leaks)
    // We do not tell the user IF the email was correct. We only say the combination failed.
    if (!user || user.passwordHash !== hashedPassword) {
      this.updateRateLimit(true);
      return { error: "Authentication Failed: Invalid email or password combination." };
    }

    this.updateRateLimit(false);
    const token = this.generateToken(user);
    return {
      user: { id: user.id, name: user.name, email: user.email, token }
    };
  }

  /**
   * SECTION 6: Forgot Password Logic
   * High-level simulation of an email-based reset flow.
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    // To prevent user enumeration, we always return a positive generic message.
    await new Promise(r => setTimeout(r, 1200));

    return { 
      success: true, 
      message: "Security Protocol: If this identity is registered in our vault, a reset link has been dispatched." 
    };
  }

  private getUsers(): any[] {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}

export const authService = new AuthService();
