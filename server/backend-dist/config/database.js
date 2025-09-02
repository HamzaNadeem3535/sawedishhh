"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.supabaseClient = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration. Please check your environment variables.');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
    throw new Error('Missing Supabase anon key. Please check your environment variables.');
}
exports.supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
const testConnection = async () => {
    try {
        const { data, error } = await exports.supabase
            .from('profiles')
            .select('count')
            .limit(1);
        if (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        }
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        return false;
    }
};
exports.testConnection = testConnection;
//# sourceMappingURL=database.js.map