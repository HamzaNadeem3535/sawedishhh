"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = void 0;
const crypto_1 = __importDefault(require("crypto"));
class Helpers {
    static generateId() {
        return crypto_1.default.randomUUID();
    }
    static generateReference(prefix = 'REF') {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${timestamp.slice(-6)}-${random}`;
    }
    static formatCurrency(amount, currency = 'SEK') {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency
        }).format(amount);
    }
    static formatDate(date, locale = 'sv-SE') {
        return new Date(date).toLocaleDateString(locale);
    }
    static formatDateTime(date, locale = 'sv-SE') {
        return new Date(date).toLocaleString(locale);
    }
    static calculatePercentage(value, total) {
        if (total === 0)
            return 0;
        return Math.round((value / total) * 100 * 100) / 100;
    }
    static validateSwedishPersonalNumber(personalNumber) {
        const regex = /^(\d{8})-(\d{4})$/;
        if (!regex.test(personalNumber))
            return false;
        const [datePart, lastFour] = personalNumber.split('-');
        if (!datePart)
            return false;
        const year = parseInt(datePart.substring(0, 4));
        const month = parseInt(datePart.substring(4, 6));
        const day = parseInt(datePart.substring(6, 8));
        if (month < 1 || month > 12)
            return false;
        if (day < 1 || day > 31)
            return false;
        if (year < 1900 || year > new Date().getFullYear())
            return false;
        return true;
    }
    static validateSwedishOrganizationNumber(orgNumber) {
        const regex = /^(\d{6})-(\d{4})$/;
        return regex.test(orgNumber);
    }
    static sanitizeString(input) {
        return input.trim().replace(/[<>]/g, '');
    }
    static generateInvoiceNumber(year) {
        const currentYear = year || new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-6);
        return `INV-${currentYear}-${timestamp}`;
    }
    static generateJournalEntryNumber(year) {
        const currentYear = year || new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-6);
        return `JE-${currentYear}-${timestamp}`;
    }
    static calculateTax(amount, taxRate) {
        return Math.round(amount * (taxRate / 100) * 100) / 100;
    }
    static calculateNetAmount(grossAmount, taxRate) {
        const tax = this.calculateTax(grossAmount, taxRate);
        return grossAmount + tax;
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    static maskPersonalNumber(personalNumber) {
        return personalNumber.replace(/(\d{8})-(\d{4})/, '$1-****');
    }
    static maskBankAccount(accountNumber) {
        if (accountNumber.length <= 4)
            return accountNumber;
        const visiblePart = accountNumber.slice(-4);
        const maskedPart = '*'.repeat(accountNumber.length - 4);
        return maskedPart + visiblePart;
    }
    static getDaysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    static isDateInRange(date, startDate, endDate) {
        const checkDate = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return checkDate >= start && checkDate <= end;
    }
    static generateSecureToken(length = 32) {
        return crypto_1.default.randomBytes(length).toString('hex');
    }
    static hashPassword(password) {
        return crypto_1.default.createHash('sha256').update(password).digest('hex');
    }
    static comparePasswords(password, hashedPassword) {
        const hashedInput = this.hashPassword(password);
        return hashedInput === hashedPassword;
    }
}
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map