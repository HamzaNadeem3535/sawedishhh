"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.invalidateCache = exports.foundationDataCache = exports.userDataCache = exports.staticDataCache = exports.longCache = exports.mediumCache = exports.shortCache = exports.cacheMiddleware = void 0;
class MemoryCache {
    cache = new Map();
    set(key, data, ttl) {
        const expires = Date.now() + (ttl * 1000);
        this.cache.set(key, { data, expires });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            return null;
        }
        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expires) {
                this.cache.delete(key);
            }
        }
    }
}
const cache = new MemoryCache();
exports.cache = cache;
setInterval(() => {
    cache.cleanup();
}, 5 * 60 * 1000);
const cacheMiddleware = (options) => {
    return (req, res, next) => {
        if (options.condition && !options.condition(req)) {
            return next();
        }
        const cacheKey = options.key
            ? options.key(req)
            : `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(cachedData);
        }
        const originalJson = res.json;
        res.json = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache.set(cacheKey, data, options.ttl);
                res.setHeader('X-Cache', 'MISS');
            }
            return originalJson.call(this, data);
        };
        next();
    };
};
exports.cacheMiddleware = cacheMiddleware;
exports.shortCache = (0, exports.cacheMiddleware)({ ttl: 300 });
exports.mediumCache = (0, exports.cacheMiddleware)({ ttl: 1800 });
exports.longCache = (0, exports.cacheMiddleware)({ ttl: 3600 });
exports.staticDataCache = (0, exports.cacheMiddleware)({
    ttl: 3600,
    condition: (req) => req.method === 'GET'
});
exports.userDataCache = (0, exports.cacheMiddleware)({
    ttl: 600,
    key: (req) => `user:${req.user?.id}:${req.originalUrl}`,
    condition: (req) => req.method === 'GET' && !!req.user
});
exports.foundationDataCache = (0, exports.cacheMiddleware)({
    ttl: 900,
    key: (req) => {
        const foundationId = req.params.foundationId || req.query.foundation_id;
        return `foundation:${foundationId}:${req.originalUrl}`;
    },
    condition: (req) => req.method === 'GET'
});
exports.invalidateCache = {
    user: (userId) => {
        console.log(`Invalidating cache for user: ${userId}`);
    },
    foundation: (foundationId) => {
        console.log(`Invalidating cache for foundation: ${foundationId}`);
    },
    all: () => {
        cache.clear();
        console.log('All cache cleared');
    }
};
//# sourceMappingURL=cache.js.map