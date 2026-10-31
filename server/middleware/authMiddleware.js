import { getAuth } from '@clerk/express';

/**
 * Protects routes by verifying the user has an active Clerk session.
 * Attaches the Clerk userId to `req.userId` for downstream controllers.
 */
export const protect = (req, res, next) => {
    // Retrieve authentication state attached by clerkMiddleware
    const auth = req.auth || (getAuth ? getAuth(req) : null);
    const userId = auth?.userId;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Please log in to access this resource.',
        });
    }

    // Attach userId for easy access in controllers
    req.userId = userId;
    next();
};