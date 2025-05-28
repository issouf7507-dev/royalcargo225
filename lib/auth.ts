import jwt from "jsonwebtoken";

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_secret_jwt"
    );
    return decoded;
  } catch (error) {
    return null;
  }
}
