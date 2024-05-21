

export interface SignupInfo {
    accessToken: string;
    auth: {
      // Properties of AuthImpl
      // Define the properties of AuthImpl based on your requirements
    };
    displayName: string | null;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    metadata: metadata;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
    stsTokenManager: stsTokenManager
    tenantId: string | null;
    uid: string;
  }
  
  export interface stsTokenManager {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  }

  export interface metadata {
    createdAt: string;
      lastLoginAt: string;
      lastSignInTime: string;
      creationTime: string;
  }