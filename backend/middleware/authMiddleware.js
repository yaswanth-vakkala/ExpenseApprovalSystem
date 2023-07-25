import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const userWithAccess = asyncHandler(async (req, res, next) => {
  if (
    req.user &&
    (req.user.userType === 'HR' ||
      req.user.userType === 'FinanceDepartment' ||
      req.user.userType === 'Director' ||
      req.user.userType === 'Admin')
  ) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as you are an Employee');
  }
});

// const Director = asyncHandler(async (req, res, next) => {
//   if (req.user && req.user.userType === 'Director') {
//     next();
//   } else {
//     res.status(401);
//     throw new Error('Not authorized as Director');
//   }
// });

const FinanceDepartmentOrAdmin = asyncHandler(async (req, res, next) => {
  if (
    req.user &&
    (req.user.userType === 'FinanceDepartment' || req.user.userType === 'Admin')
  ) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as FinanceDepartment or Admin');
  }
});

const FinanceDepartmentOrHR = asyncHandler(async (req, res, next) => {
  if (
    req.user &&
    (req.user.userType === 'FinanceDepartment' || req.user.userType === 'HR')
  ) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as FinanceDepartment or HR');
  }
});

const FinanceDepartmentOrAdminOrDirector = asyncHandler(
  async (req, res, next) => {
    if (
      req.user &&
      (req.user.userType === 'FinanceDepartment' ||
        req.user.userType === 'Admin' ||
        req.user.userType === 'Director')
    ) {
      next();
    } else {
      res.status(401);
      throw new Error('Not authorized as FinanceDepartment or Admin');
    }
  }
);

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.userType === 'Admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

const employeeOnly = (req, res, next) => {
  if (req.user && req.user.userType === 'Employee') {
    next();
  } else {
    res.status(401);
    throw new Error('Only Employee can delete their expense!');
  }
};

const directorOnly = (req, res, next) => {
  if (req.user && req.user.userType === 'Director') {
    next();
  } else {
    res.status(401);
    throw new Error('Only Director can access this route!');
  }
};

export {
  protect,
  admin,
  userWithAccess,
  FinanceDepartmentOrAdmin,
  FinanceDepartmentOrAdminOrDirector,
  employeeOnly,
  directorOnly,
  FinanceDepartmentOrHR
};
