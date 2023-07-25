import { EXPENSES_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const expensesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: ({ pageNumber, keyword }) => ({
        url: EXPENSES_URL,
        params: {
          pageNumber,
          keyword,
        },
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Expenses'],
    }),
    createExpenseReport: builder.mutation({
      query: (data) => ({
        url: `${EXPENSES_URL}/report`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Expense'],
    }),
    createProjectExpenseReport: builder.mutation({
      query: (data) => ({
        url: `${EXPENSES_URL}/projectReport`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Expense'],
    }),
    getExpensesHistory: builder.query({
      query: ({ pageNumber, keyword }) => ({
        url: `${EXPENSES_URL}/history`,
        params: {
          pageNumber,
          keyword,
        },
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Expense'],
    }),
    getExpenseDetails: builder.query({
      query: (expenseId) => ({
        url: `${EXPENSES_URL}/${expenseId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createExpense: builder.mutation({
      query: (data) => ({
        url: `${EXPENSES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Expense'],
    }),
    updateExpense: builder.mutation({
      query: (data) => ({
        url: `${EXPENSES_URL}/${data._id}`,
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      }),
      invalidatesTags: ['Expenses'],
    }),
    updateExpenseById: builder.mutation({
      query: (id) => ({
        url: `${EXPENSES_URL}/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Expenses'],
    }),
    uploadExpenseImages: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteExpense: builder.mutation({
      query: (expenseId) => ({
        url: `${EXPENSES_URL}/${expenseId}`,
        method: 'DELETE',
      }),
      providesTags: ['Expense'],
    }),
    deleteExpenseIMage: builder.mutation({
      query: (expenseImg) => ({
        url: `${UPLOAD_URL}`,
        body: expenseImg,
        method: 'DELETE',
      }),
      providesTags: ['Expense'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useCreateExpenseReportMutation,
  useGetExpensesHistoryQuery,
  useGetExpenseDetailsQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useUpdateExpenseByIdMutation,
  useUploadExpenseImagesMutation,
  useDeleteExpenseMutation,
  useDeleteExpenseIMageMutation,
  useCreateProjectExpenseReportMutation,
} = expensesApiSlice;
