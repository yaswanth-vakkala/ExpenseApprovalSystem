import asyncHandler from '../middleware/asyncHandler.js';
import Expense from '../models/ExpenseModel.js';

// @desc    Get expenses History list
// @route   GET /api/history
// @access  Private
const getExpenseHistory = asyncHandler(async (req, res) => {
  const pageSize = process.env.EXPENSES_HISTORY_PAGINATION_LIMIT || 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        $or: [
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { projName: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  if (req.user.userType === 'Employee') {
    let count = await Expense.find({
      user: req.user._id,
      status: {
        $in: ['Reimbursed', 'Rejected'],
      },
      ...keyword,
    });
    count = count.length;
    const expenses = await Expense.find({
      user: req.user._id,
      status: {
        $in: ['Reimbursed', 'Rejected'],
      },
      ...keyword,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({
        createdAt: -1,
      });
    res
      .status(200)
      .json({ expenses, page, pages: Math.ceil(count / pageSize) });
  } else if (req.user.userType === 'HR') {
    let keyword = req.query.keyword
      ? { empId: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    let count = await Expense.find({
      $or: [
        { currentStatus: 'EmployeeRequested', status: 'Rejected' },
        {
          currentStatus: 'HRApproved',
          status: { $in: ['Rejected', 'InProcess'] },
        },
        {
          currentStatus: 'DirectorApproved',
          status: { $in: ['Rejected', 'InProcess'] },
        },
        { currentStatus: 'FinanceDepartmentApproved', status: 'Reimbursed' },
      ],
      ...keyword,
    });
    count = count.length;
    const expenses = await Expense.find({
      $or: [
        { currentStatus: 'EmployeeRequested', status: 'Rejected' },
        {
          currentStatus: 'HRApproved',
          status: { $in: ['Rejected', 'InProcess'] },
        },
        {
          currentStatus: 'DirectorApproved',
          status: { $in: ['Rejected', 'InProcess'] },
        },
        { currentStatus: 'FinanceDepartmentApproved', status: 'Reimbursed' },
      ],
      ...keyword,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({
        createdAt: -1,
      });
    res
      .status(200)
      .json({ expenses, page, pages: Math.ceil(count / pageSize) });
  } else if (req.user.userType === 'Director') {
    const keyword = req.query.keyword
      ? { empId: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    let count = await Expense.find({
      $or: [
        {
          currentStatus: 'HRApproved',
          status: { $in: ['Rejected'] },
        },
        {
          currentStatus: 'DirectorApproved',
          status: { $in: ['Rejected', 'InProcess'] },
        },
        { currentStatus: 'FinanceDepartmentApproved', status: 'Reimbursed' },
      ],
      ...keyword,
    });
    count = count.length;
    const expenses = await Expense.find({
      $or: [
        {
          currentStatus: 'HRApproved',
          status: { $in: ['Rejected'] },
        },
        {
          currentStatus: 'DirectorApproved',
          status: { $in: ['Rejected', 'InProcess'] },
        },
        { currentStatus: 'FinanceDepartmentApproved', status: 'Reimbursed' },
      ],
      ...keyword,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({
        createdAt: -1,
      });
    res
      .status(200)
      .json({ expenses, page, pages: Math.ceil(count / pageSize) });
  } else if (req.user.userType === 'FinanceDepartment') {
    const keyword = req.query.keyword
      ? { empId: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    let count = await Expense.find({
      currentStatus: {
        $in: ['DirectorApproved', 'FinanceDepartmentApproved'],
      },
      status: { $in: ['Reimbursed', 'Rejected'] },
      ...keyword,
    });
    count = count.length;
    const expenses = await Expense.find({
      currentStatus: {
        $in: ['DirectorApproved', 'FinanceDepartmentApproved'],
      },
      status: { $in: ['Reimbursed', 'Rejected'] },
      ...keyword,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({
        createdAt: -1,
      });
    res
      .status(200)
      .json({ expenses, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404);
    throw new Error('Expenses not found');
  }
});

// @desc    Get expenses list
// @route   GET /api/expense
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const pageSize = process.env.EXPENSES_PAGINATION_LIMIT || 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        $or: [
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { projName: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};
  if (req.user.userType === 'Employee') {
    let count = await Expense.find({
      user: req.user._id,
      status: 'InProcess',
      ...keyword,
    });
    count = count.length;
    const expenses = await Expense.find({
      user: req.user._id,
      status: 'InProcess',
      ...keyword,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({
        createdAt: -1,
      });
    res
      .status(200)
      .json({ expenses, page, pages: Math.ceil(count / pageSize) });
  } else if (req.user.userType === 'HR') {
    const keyword = req.query.keyword
      ? { empId: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    let count = await Expense.find({
      currentStatus: 'EmployeeRequested',
      status: 'InProcess',
      ...keyword,
    });
    count = count.length;
    const expenses = await Expense.find({
      currentStatus: 'EmployeeRequested',
      status: 'InProcess',
      ...keyword,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res
      .status(200)
      .json({ expenses, page, pages: Math.ceil(count / pageSize) });
  } else if (req.user.userType === 'Director') {
    const keyword = req.query.keyword
      ? { empId: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    let count = await Expense.find({
      currentStatus: 'HRApproved',
      status: 'InProcess',
      ...keyword,
    });
    count = count.length;
    const expenses = await Expense.find({
      currentStatus: 'HRApproved',
      status: 'InProcess',
      ...keyword,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res
      .status(200)
      .json({ expenses, page, pages: Math.ceil(count / pageSize) });
  } else if (req.user.userType === 'FinanceDepartment') {
    const keyword = req.query.keyword
      ? { empId: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    let count = await Expense.find({
      currentStatus: 'DirectorApproved',
      status: 'InProcess',
      ...keyword,
    });
    count = count.length;
    const expenses = await Expense.find({
      currentStatus: 'DirectorApproved',
      status: 'InProcess',
      ...keyword,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res
      .status(200)
      .json({ expenses, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404);
    throw new Error('Expenses not found');
  }
});

// @desc    Fetch single expense
// @route   GET /api/expense/:id
// @access  Private
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (expense) {
    return res.json(expense);
  }
  res.status(404);
  throw new Error('Resource not found');
});

// @desc    Get expenses report
// @route   GET /api/report
// @access  Private
const getReport = asyncHandler(async (req, res) => {
  const { firstDay, lastDay } = req.body;
  let report1 = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(firstDay),
          $lte: new Date(lastDay),
        },
        status: 'Reimbursed',
      },
    },
    {
      $group: {
        _id: null,
        totalExpenseCost: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);
  let report2 = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(firstDay),
          $lte: new Date(lastDay),
        },
        status: { $in: ['Rejected', 'InProcess'] },
      },
    },
    {
      $group: {
        _id: null,
        totalExpenseCost: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  let report3 = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(firstDay),
          $lte: new Date(lastDay),
        },
        status: 'Reimbursed',
      },
    },
    {
      $group: {
        _id: null,
        avgTime: {
          $avg: {
            $dateDiff: {
              startDate: '$createdAt',
              endDate: '$updatedAt',
              unit: 'hour',
            },
          },
        },
      },
    },
  ]);

  let report4 = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(firstDay),
          $lte: new Date(lastDay),
        },
        status: { $in: ['Rejected', 'Reimbursed'] },
      },
    },
    {
      $group: {
        _id: null,
        avgTime: {
          $avg: {
            $dateDiff: {
              startDate: '$createdAt',
              endDate: '$updatedAt',
              unit: 'hour',
            },
          },
        },
      },
    },
  ]);
  if (report1.length === 0) {
    report1 = [{ _id: null, totalExpenseCost: 0, count: 0 }];
  }
  if (report2.length === 0) {
    report2 = [{ _id: null, totalExpenseCost: 0, count: 0 }];
  }
  if (report3.length === 0) {
    report3 = [{ _id: null, avgTime: 0 }];
  }
  if (report4.length === 0) {
    report4 = [{ _id: null, avgTime: 0 }];
  }
  if (report1 && report2) {
    res.status(200).json({ report1, report2, report3, report4 });
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Get expenses report
// @route   GET /api/report
// @access  Private
const getProjectReport = asyncHandler(async (req, res) => {
  const { projectId } = req.body;
  let projectReport1 = await Expense.aggregate([
    {
      $match: {
        projId: projectId,
        status: { $in: ['Reimbursed'] },
      },
    },
    {
      $group: {
        _id: '$projId',
        totalExpenseCost: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);
  let projectReport2 = await Expense.aggregate([
    {
      $match: {
        projId: projectId,
        status: { $in: ['Rejected', 'InProcess'] },
      },
    },
    {
      $group: {
        _id: '$projId',
        totalExpenseCost: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);
  if (projectReport1.length === 0) {
    projectReport1 = [{ _id: {}, totalExpenseCost: 0, count: 0 }];
  }
  if (projectReport2.length === 0) {
    projectReport2 = [{ _id: {}, totalExpenseCost: 0, count: 0 }];
  }
  if (projectReport1 && projectReport2) {
    res.status(200).json({ projectReport1, projectReport2 });
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Create an Expense
// @route   POST /api/expense
// @access  Private/Admin
const createExpense = asyncHandler(async (req, res) => {
  const {
    empName,
    empId,
    projName,
    projId,
    billProof,
    status,
    amount,
    description,
    date,
  } = req.body;
  const expense = new Expense({
    empName,
    empId,
    projName,
    projId,
    billProof,
    status,
    amount,
    description,
    date,
    user: req.user._id,
  });

  if (expense) {
    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } else {
    res.status(409);
    throw new Error('Expense creation failed');
  }
});

// @desc    Delete a product
// @route   DELETE /api/expense/:id
// @access  Private/Admin
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (
    expense &&
    expense.currentStatus === 'EmployeeRequested' &&
    expense.status === 'InProcess'
  ) {
    await Expense.deleteOne({ _id: expense._id });
    res.json({ message: 'Expense deleted' });
  } else {
    res.status(404);
    throw new Error('Expense not found');
  }
});

// @desc    Update an Expense
// @route   PUT /api/expense/:id
// @access  Private/Admin
const updateExpense = asyncHandler(async (req, res) => {
  const user = req.user;
  const expense = await Expense.findById(req.params.id);

  if (expense) {
    if (user.userType === 'HR') {
      if (req.body.currentStatus === 'HRApproved') {
        expense.currentStatus = 'HRApproved';
      } else if (req.body.status === 'Rejected') {
        expense.status = 'Rejected';
        expense.rejectionReason = req.body.rejectionReason;
      }
    } else if (user.userType === 'FinanceDepartment') {
      if (req.body.currentStatus === 'FinanceDepartmentApproved') {
        expense.currentStatus = 'FinanceDepartmentApproved';
        expense.status = 'Reimbursed';
      } else if (req.body.status === 'Rejected') {
        expense.status = 'Rejected';
        expense.rejectionReason = req.body.rejectionReason;
      }
    } else if (user.userType === 'Director') {
      if (req.body.currentStatus === 'DirectorApproved') {
        expense.currentStatus = 'DirectorApproved';
      } else if (req.body.status === 'Rejected') {
        expense.status = 'Rejected';
        expense.rejectionReason = req.body.rejectionReason;
      }
    }
    await expense.save();
    res.json({ message: 'success' });
  } else {
    res.status(404);
    throw new Error('Expense not found');
  }
});

// @desc    Update an Expense
// @route   PUT /api/expense/:id
// @access  Private/Admin
const updateExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  const user = req.user;

  if (expense) {
    if (user.userType === 'HR') {
      expense.currentStatus = 'HRApproved';
    } else if (user.userType === 'FinanceDepartment') {
      (expense.currentStatus = 'FinanceDepartmentApproved'),
        (expense.status = 'Reimbursed');
    }
    await expense.save();
    res.json({ message: 'success' });
  } else {
    res.status(404);
    throw new Error('Expense not found');
  }
});

export {
  getExpenseHistory,
  getExpenses,
  getExpenseById,
  createExpense,
  deleteExpense,
  updateExpense,
  getReport,
  getProjectReport,
  updateExpenseById,
};
