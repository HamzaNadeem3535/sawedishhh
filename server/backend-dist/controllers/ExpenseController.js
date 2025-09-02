"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class ExpenseController {
    static getExpenses = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id, status, category } = req.query;
        let query = database_1.supabase
            .from('expenses')
            .select(`
        *,
        foundations(name),
        profiles!expenses_user_id_fkey(full_name, email)
      `)
            .order('created_at', { ascending: false });
        if (foundation_id) {
            query = query.eq('foundation_id', foundation_id);
        }
        if (status) {
            query = query.eq('status', status);
        }
        if (category) {
            query = query.eq('category', category);
        }
        const { data: expenses, error } = await query;
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        res.json({
            expenses: expenses || [],
            total: expenses?.length || 0
        });
    });
    static getExpenseById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: expense, error } = await database_1.supabase
            .from('expenses')
            .select(`
        *,
        foundations(name),
        profiles!expenses_user_id_fkey(full_name, email)
      `)
            .eq('id', id)
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)('Expense not found', 404);
        }
        res.json({ expense });
    });
    static createExpense = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id, amount, currency, category, description, expense_date } = req.body;
        const file = req.file;
        let receiptUrl = null;
        if (file) {
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = `receipts/${foundation_id}/${fileName}`;
            const { error: uploadError } = await database_1.supabase.storage
                .from('receipts')
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });
            if (uploadError) {
                throw (0, errorHandler_1.createError)('Receipt upload failed', 500);
            }
            receiptUrl = filePath;
        }
        const { data: expense, error } = await database_1.supabase
            .from('expenses')
            .insert({
            foundation_id,
            user_id: req.user?.id,
            amount: parseFloat(amount),
            currency,
            category,
            description,
            receipt_url: receiptUrl,
            expense_date,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            if (receiptUrl) {
                await database_1.supabase.storage.from('receipts').remove([receiptUrl]);
            }
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.status(201).json({
            message: 'Expense created successfully',
            expense
        });
    });
    static updateExpense = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { amount, category, description, expense_date, status, rejection_reason } = req.body;
        const { data: expense, error } = await database_1.supabase
            .from('expenses')
            .update({
            amount: amount ? parseFloat(amount) : undefined,
            category,
            description,
            expense_date,
            status,
            rejection_reason,
            approved_by: status === 'approved' ? req.user?.id : null,
            approved_at: status === 'approved' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({
            message: 'Expense updated successfully',
            expense
        });
    });
    static deleteExpense = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: expense, error: fetchError } = await database_1.supabase
            .from('expenses')
            .select('receipt_url')
            .eq('id', id)
            .single();
        if (fetchError) {
            throw (0, errorHandler_1.createError)('Expense not found', 404);
        }
        if (expense.receipt_url) {
            await database_1.supabase.storage
                .from('receipts')
                .remove([expense.receipt_url]);
        }
        const { error } = await database_1.supabase
            .from('expenses')
            .delete()
            .eq('id', id);
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({ message: 'Expense deleted successfully' });
    });
    static approveExpense = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: expense, error } = await database_1.supabase
            .from('expenses')
            .update({
            status: 'approved',
            approved_by: req.user?.id,
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({
            message: 'Expense approved successfully',
            expense
        });
    });
    static rejectExpense = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { rejection_reason } = req.body;
        const { data: expense, error } = await database_1.supabase
            .from('expenses')
            .update({
            status: 'rejected',
            rejection_reason,
            approved_by: req.user?.id,
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({
            message: 'Expense rejected successfully',
            expense
        });
    });
    static downloadReceipt = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: expense, error: expenseError } = await database_1.supabase
            .from('expenses')
            .select('receipt_url, description')
            .eq('id', id)
            .single();
        if (expenseError) {
            throw (0, errorHandler_1.createError)('Expense not found', 404);
        }
        if (!expense.receipt_url) {
            throw (0, errorHandler_1.createError)('No receipt available', 404);
        }
        const { data: signedUrl, error: urlError } = await database_1.supabase.storage
            .from('receipts')
            .createSignedUrl(expense.receipt_url, 3600);
        if (urlError) {
            throw (0, errorHandler_1.createError)('Failed to generate download URL', 500);
        }
        res.json({
            download_url: signedUrl.signedUrl,
            description: expense.description
        });
    });
}
exports.ExpenseController = ExpenseController;
//# sourceMappingURL=ExpenseController.js.map