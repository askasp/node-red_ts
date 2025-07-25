/**
 * Template Type Definitions
 * Shared interfaces for TypeScript Function and Template nodes
 */

// User profile data interface
export interface UserProfileData {
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: 'admin' | 'user' | 'moderator';
    };
    stats: {
        loginCount: number;
        lastLogin: Date;
        isActive: boolean;
        joinedDate: Date;
    };
    preferences: {
        theme: 'light' | 'dark';
        language: string;
        notifications: boolean;
        timezone: string;
    };
}

// Dashboard data interface
export interface DashboardData {
    title: string;
    subtitle?: string;
    user: UserProfileData['user'];
    widgets: Array<{
        id: string;
        type: 'chart' | 'counter' | 'list' | 'table';
        title: string;
        data: any;
        config?: {
            refreshInterval?: number;
            height?: number;
            color?: string;
        };
    }>;
    stats: {
        totalUsers: number;
        activeUsers: number;
        totalRevenue: number;
        growth: number;
    };
    timestamp: string;
}

// Form data interface
export interface ContactFormData {
    formTitle: string;
    formDescription?: string;
    fields: Array<{
        name: string;
        label: string;
        type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
        required: boolean;
        value?: any;
        placeholder?: string;
        options?: Array<{
            value: string;
            text: string;
            selected?: boolean;
        }>;
        validation?: {
            minLength?: number;
            maxLength?: number;
            pattern?: string;
        };
    }>;
    submitUrl: string;
    method: 'GET' | 'POST' | 'PUT';
    successMessage?: string;
    errorMessage?: string;
}

// Product catalog interface
export interface ProductCatalogData {
    title: string;
    categories: Array<{
        id: string;
        name: string;
        description?: string;
        products: Array<{
            id: string;
            name: string;
            description: string;
            price: number;
            currency: string;
            image?: string;
            availability: 'in-stock' | 'out-of-stock' | 'pre-order';
            rating?: {
                average: number;
                count: number;
            };
            tags: string[];
        }>;
    }>;
    filters: {
        priceRange: {
            min: number;
            max: number;
        };
        availableCategories: string[];
        sortOptions: Array<{
            value: string;
            label: string;
        }>;
    };
    pagination: {
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
    };
}

// API response wrapper
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    metadata?: {
        timestamp: string;
        requestId: string;
        version: string;
    };
}

// Common component props
export interface ComponentProps {
    className?: string;
    id?: string;
    style?: Record<string, string>;
    'data-testid'?: string;
}

// Navigation data
export interface NavigationData {
    brand: {
        name: string;
        logo?: string;
        href: string;
    };
    items: Array<{
        label: string;
        href: string;
        active?: boolean;
        children?: Array<{
            label: string;
            href: string;
            description?: string;
        }>;
    }>;
    user?: {
        name: string;
        avatar?: string;
        menu: Array<{
            label: string;
            href: string;
            icon?: string;
        }>;
    };
}

// Table data interface
export interface TableData<T = any> {
    title?: string;
    columns: Array<{
        key: string;
        label: string;
        sortable?: boolean;
        type?: 'text' | 'number' | 'date' | 'boolean' | 'action';
        format?: string;
        width?: string;
    }>;
    rows: T[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalItems: number;
    };
    actions?: Array<{
        label: string;
        action: string;
        icon?: string;
        color?: 'primary' | 'secondary' | 'danger' | 'warning';
    }>;
} 