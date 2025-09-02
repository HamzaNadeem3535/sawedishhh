"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class ReportController {
    static getDashboardAnalytics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const { data: foundations, error: foundationsError } = await database_1.supabase
            .from('foundations')
            .select('id, status')
            .eq('owner_user_id', userId);
        if (foundationsError) {
            throw (0, errorHandler_1.createError)(foundationsError.message, 500);
        }
        const { data: activities, error: activitiesError } = await database_1.supabase
            .from('audit_logs')
            .select(`
        *,
        profiles(full_name)
      `)
            .order('timestamp', { ascending: false })
            .limit(10);
        if (activitiesError) {
            throw (0, errorHandler_1.createError)(activitiesError.message, 500);
        }
        const analytics = {
            foundations: {
                total: foundations?.length || 0,
                active: foundations?.filter(f => f.status === 'active').length || 0,
                pending: foundations?.filter(f => f.status === 'pending_verification').length || 0
            },
            recent_activities: activities || []
        };
        res.json({ analytics });
    });
    static getFinancialOverview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id, period_start, period_end } = req.query;
        let expenseQuery = database_1.supabase
            .from('expenses')
            .select('amount, currency, category, status');
        if (foundation_id) {
            expenseQuery = expenseQuery.eq('foundation_id', foundation_id);
        }
        if (period_start && period_end) {
            expenseQuery = expenseQuery
                .gte('expense_date', period_start)
                .lte('expense_date', period_end);
        }
        const { data: expenses, error: expensesError } = await expenseQuery;
        if (expensesError) {
            throw (0, errorHandler_1.createError)(expensesError.message, 500);
        }
        let investmentQuery = database_1.supabase
            .from('investments')
            .select('amount, current_value, currency, type');
        if (foundation_id) {
            investmentQuery = investmentQuery.eq('foundation_id', foundation_id);
        }
        const { data: investments, error: investmentsError } = await investmentQuery;
        if (investmentsError) {
            throw (0, errorHandler_1.createError)(investmentsError.message, 500);
        }
        const overview = {
            expenses: {
                total: expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
                by_category: expenses?.reduce((acc, exp) => {
                    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                    return acc;
                }, {}) || {},
                by_status: expenses?.reduce((acc, exp) => {
                    acc[exp.status] = (acc[exp.status] || 0) + 1;
                    return acc;
                }, {}) || {}
            },
            investments: {
                total_invested: investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0,
                current_value: investments?.reduce((sum, inv) => sum + (inv.current_value || inv.amount), 0) || 0,
                by_type: investments?.reduce((acc, inv) => {
                    acc[inv.type] = (acc[inv.type] || 0) + inv.amount;
                    return acc;
                }, {}) || {}
            }
        };
        res.json({ overview });
    });
    static getExpenseAnalytics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id } = req.query;
        let query = database_1.supabase
            .from('expenses')
            .select('amount, category, expense_date, status');
        if (foundation_id) {
            query = query.eq('foundation_id', foundation_id);
        }
        const { data: expenses, error } = await query;
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        const analytics = {
            total_amount: expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
            by_category: expenses?.reduce((acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                return acc;
            }, {}) || {},
            by_status: expenses?.reduce((acc, exp) => {
                acc[exp.status] = (acc[exp.status] || 0) + 1;
                return acc;
            }, {}) || {},
            monthly_trends: generateMonthlyTrends(expenses || [])
        };
        res.json({ analytics });
    });
    static getInvestmentAnalytics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id } = req.query;
        let query = database_1.supabase
            .from('investments')
            .select('amount, current_value, type, performance, acquisition_date');
        if (foundation_id) {
            query = query.eq('foundation_id', foundation_id);
        }
        const { data: investments, error } = await query;
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        const analytics = {
            total_invested: investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0,
            current_value: investments?.reduce((sum, inv) => sum + (inv.current_value || inv.amount), 0) || 0,
            total_gain_loss: investments?.reduce((sum, inv) => sum + ((inv.current_value || inv.amount) - inv.amount), 0) || 0,
            by_type: investments?.reduce((acc, inv) => {
                acc[inv.type] = (acc[inv.type] || 0) + inv.amount;
                return acc;
            }, {}) || {},
            performance_summary: {
                best_performer: investments && investments.length > 0
                    ? investments.reduce((best, inv) => (inv.performance || 0) > ((best?.performance ?? 0)) ? inv : best, investments[0])
                    : null,
                worst_performer: investments && investments.length > 0
                    ? investments.reduce((worst, inv) => (inv.performance || 0) < ((worst?.performance ?? 0)) ? inv : worst, investments[0])
                    : null
            }
        };
        res.json({ analytics });
    });
    static getProjectAnalytics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id } = req.query;
        let query = database_1.supabase
            .from('projects')
            .select('status, budget, progress_percentage, start_date, end_date');
        if (foundation_id) {
            query = query.eq('foundation_id', foundation_id);
        }
        const { data: projects, error } = await query;
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        const analytics = {
            total_projects: projects?.length || 0,
            by_status: projects?.reduce((acc, proj) => {
                acc[proj.status] = (acc[proj.status] || 0) + 1;
                return acc;
            }, {}) || {},
            total_budget: projects?.reduce((sum, proj) => sum + (proj.budget || 0), 0) || 0,
            average_progress: projects?.reduce((sum, proj) => sum + proj.progress_percentage, 0) / (projects?.length || 1) || 0
        };
        res.json({ analytics });
    });
    static getComplianceAnalytics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const analytics = {
            total_items: 15,
            by_status: {
                completed: 12,
                in_progress: 2,
                overdue: 1
            },
            by_regulation: {
                lansstyrelsen: 8,
                skatteverket: 4,
                bolagsverket: 3
            },
            upcoming_deadlines: 3
        };
        res.json({ analytics });
    });
    static exportReport = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { report_type, format } = req.query;
        const exportData = {
            export_id: Date.now().toString(),
            report_type,
            format: format || 'pdf',
            status: 'generating',
            estimated_completion: new Date(Date.now() + 30000).toISOString()
        };
        res.json({
            message: 'Report export initiated',
            export: exportData
        });
    });
}
exports.ReportController = ReportController;
function generateMonthlyTrends(expenses) {
    const monthlyData = {};
    expenses.forEach(expense => {
        const month = new Date(expense.expense_date).toISOString().slice(0, 7);
        monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });
    return Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount
    }));
}
//# sourceMappingURL=ReportController.js.map