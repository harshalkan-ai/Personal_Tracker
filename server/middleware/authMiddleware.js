import { getAuth } from '@clerk/express';

/**
 * Protects routes by verifying the user has an active Clerk session.
 * Attaches the Clerk userId to `req.userId` for downstream controllers.
 */
export const protect = (req, res, next) => {
    // Retrieve authentication state attached by clerkMiddleware
    let authObj = null;

    if (typeof req.auth === 'function') {
        authObj = req.auth();
    } else if (req.auth) {
        authObj = req.auth;
    } else if (typeof getAuth === 'function') {
        authObj = getAuth(req);
    }

    const userId = authObj?.userId;

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
