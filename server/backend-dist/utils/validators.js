"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
const constants_1 = require("./constants");
class Validators {
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isValidPassword(password) {
        return password.length >= constants_1.VALIDATION_RULES.PASSWORD_MIN_LENGTH;
    }
    static isValidSwedishPersonalNumber(personalNumber) {
        if (!constants_1.VALIDATION_RULES.PERSONAL_NUMBER_REGEX.test(personalNumber)) {
            return false;
        }
        const [datePart] = personalNumber.split('-');
        if (!datePart) {
            return false;
        }
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
    static isValidSwedishPhoneNumber(phone) {
        return constants_1.VALIDATION_RULES.PHONE_NUMBER_REGEX.test(phone);
    }
    static isValidSwedishOrganizationNumber(orgNumber) {
        return constants_1.VALIDATION_RULES.ORGANIZATION_NUMBER_REGEX.test(orgNumber);
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
    static isValidCurrency(currency) {
        const validCurrencies = ['SEK', 'EUR', 'USD', 'NOK', 'DKK'];
        return validCurrencies.includes(currency);
    }
    static isValidAmount(amount) {
        return amount > 0 && Number.isFinite(amount);
    }
    static isValidDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return start <= end;
    }
    static isValidPercentage(value) {
        return value >= 0 && value <= 100;
    }
    static sanitizeString(input) {
        return input.trim().replace(/[<>]/g, '');
    }
    static validateFileType(mimetype, allowedTypes) {
        return allowedTypes.includes(mimetype);
    }
    static validateFileSize(size, maxSize) {
        return size <= maxSize;
    }
    static isValidAccountNumber(accountNumber, bankName) {
        switch (bankName.toLowerCase()) {
            case 'swedbank':
                return /^\d{4}-\d{1},\d{3}\s\d{3}\s\d{3}-\d{1}$/.test(accountNumber);
            case 'handelsbanken':
                return /^\d{4},\d{3}\s\d{3}\s\d{3}$/.test(accountNumber);
            case 'seb':
                return /^\d{4}\s\d{2}\s\d{3}\s\d{1}$/.test(accountNumber);
            default:
                return accountNumber.length >= 8;
        }
    }
    static isValidIBAN(iban) {
        const swedishIBANRegex = /^SE\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/;
        return swedishIBANRegex.test(iban.replace(/\s/g, ''));
    }
    static validateBusinessHours(time) {
        const hour = new Date(`2000-01-01T${time}`).getHours();
        return hour >= 8 && hour <= 18;
    }
    static validateMeetingDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return durationHours > 0 && durationHours <= 8;
    }
    static validateBudgetAmount(amount, foundationAssets) {
        return amount <= foundationAssets * 0.5;
    }
    static validateTaxRate(rate) {
        return rate >= 0 && rate <= 100;
    }
    static validateEmployeeNumber(employeeNumber) {
        return /^EMP-\d{3,6}$/.test(employeeNumber);
    }
    static validateInvoiceNumber(invoiceNumber) {
        return /^(INV|SI)-\d{4}-\d{6}$/.test(invoiceNumber);
    }
    static validateJournalEntryNumber(entryNumber) {
        return /^JE-\d{4}-\d{6}$/.test(entryNumber);
    }
}
exports.Validators = Validators;
//# sourceMappingURL=validators.js.map