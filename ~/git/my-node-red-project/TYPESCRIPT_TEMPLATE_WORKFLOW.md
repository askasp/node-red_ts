# TypeScript Template Workflow Guide

This guide shows how to create a complete type-safe workflow from interface definition to HTML template rendering using Node-RED's TypeScript nodes.

## Complete Workflow: TypeScript File → TypeScript Function → TypeScript Template

### Step 1: Define Types (TypeScript File Node)

**Node Configuration:**
- File Path: `lib/user-types.ts`
- Content: Interface definitions

```typescript
// lib/user-types.ts
export interface UserDashboardData {
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
    };
    activities: Array<{
        id: string;
        type: 'login' | 'update' | 'view';
        description: string;
        timestamp: Date;
    }>;
    notifications: Array<{
        id: string;
        message: string;
        type: 'info' | 'warning' | 'error';
        read: boolean;
    }>;
}
```

### Step 2: Generate Data (TypeScript Function Node)

**Node Configuration:**
- Name: "Prepare User Dashboard Data"

```typescript
import { UserDashboardData } from '@userDir/lib/user-types';

export default function(msg: NodeMessage): NodeMessage {
    // TypeScript ensures we create data matching the interface
    const dashboardData: UserDashboardData = {
        user: {
            id: msg.userId || '123',
            name: msg.userName || 'John Doe',
            email: msg.userEmail || 'john@example.com', 
            avatar: msg.userAvatar,
            role: msg.userRole || 'user'
        },
        stats: {
            loginCount: msg.loginCount || 5,
            lastLogin: new Date(msg.lastLogin || Date.now()),
            isActive: msg.isActive !== false
        },
        activities: msg.activities || [
            {
                id: '1',
                type: 'login',
                description: 'Logged in from Chrome',
                timestamp: new Date()
            },
            {
                id: '2', 
                type: 'update',
                description: 'Updated profile information',
                timestamp: new Date(Date.now() - 3600000)
            }
        ],
        notifications: msg.notifications || [
            {
                id: 'n1',
                message: 'Welcome to your dashboard!',
                type: 'info',
                read: false
            },
            {
                id: 'n2',
                message: 'Please verify your email address',
                type: 'warning', 
                read: false
            }
        ]
    };

    node.log(`✅ Generated dashboard data for user: ${dashboardData.user.name}`);

    return {
        ...msg,
        payload: dashboardData  // Type-safe payload
    };
}
```

### Step 3: Render Template (TypeScript Template Node)

**Node Configuration:**
- Name: "User Dashboard Template"
- Interface Import: `@userDir/lib/user-types`
- Interface Name: `UserDashboardData`
- Output Format: `String (HTML)`

**Template:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{user.name}}'s Dashboard</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <h1 class="text-xl font-bold">Dashboard</h1>
                <div class="flex items-center space-x-4">
                    {{#user.avatar}}
                    <img src="{{user.avatar}}" alt="{{user.name}}" class="w-8 h-8 rounded-full">
                    {{/user.avatar}}
                    <span class="text-gray-700">{{user.name}}</span>
                    <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{{user.role}}</span>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 px-4">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-900">Login Count</h3>
                <p class="text-3xl font-bold text-blue-600">{{stats.loginCount}}</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-900">Status</h3>
                <p class="text-xl {{#stats.isActive}}text-green-600{{/stats.isActive}}{{^stats.isActive}}text-red-600{{/stats.isActive}}">
                    {{#stats.isActive}}🟢 Active{{/stats.isActive}}{{^stats.isActive}}🔴 Inactive{{/stats.isActive}}
                </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-900">Last Login</h3>
                <p class="text-sm text-gray-600">{{stats.lastLogin}}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Activities -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b">
                    <h2 class="text-lg font-semibold">Recent Activities</h2>
                </div>
                <div class="p-6">
                    {{#activities}}
                    <div class="flex items-center space-x-3 mb-4 last:mb-0">
                        <div class="flex-shrink-0">
                            {{#type}}
                            {{#login}}🚪{{/login}}
                            {{#update}}✏️{{/update}}  
                            {{#view}}👁️{{/view}}
                            {{/type}}
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-gray-900">{{description}}</p>
                            <p class="text-xs text-gray-500">{{timestamp}}</p>
                        </div>
                    </div>
                    {{/activities}}
                    
                    {{^activities}}
                    <p class="text-gray-500 italic">No recent activities</p>
                    {{/activities}}
                </div>
            </div>

            <!-- Notifications -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b">
                    <h2 class="text-lg font-semibold">Notifications</h2>
                </div>
                <div class="p-6">
                    {{#notifications}}
                    <div class="flex items-start space-x-3 mb-4 last:mb-0 {{^read}}bg-blue-50{{/read}} p-3 rounded">
                        <div class="flex-shrink-0 mt-1">
                            {{#type}}
                            {{#info}}ℹ️{{/info}}
                            {{#warning}}⚠️{{/warning}}
                            {{#error}}❌{{/error}}
                            {{/type}}
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-gray-900">{{message}}</p>
                            {{^read}}
                            <button hx-post="/api/notifications/{{id}}/read" 
                                    hx-target="closest div"
                                    hx-swap="outerHTML"
                                    class="text-xs text-blue-600 hover:text-blue-800 mt-1">
                                Mark as read
                            </button>
                            {{/read}}
                        </div>
                    </div>
                    {{/notifications}}
                    
                    {{^notifications}}
                    <p class="text-gray-500 italic">No notifications</p>
                    {{/notifications}}
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
            <div class="flex space-x-4">
                <button hx-get="/api/user/{{user.id}}/profile" 
                        hx-target="#main-content"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Edit Profile
                </button>
                
                <button hx-get="/api/user/{{user.id}}/settings"
                        hx-target="#main-content" 
                        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Settings
                </button>
                
                {{#user.role}}
                {{#admin}}
                <button hx-get="/api/admin/dashboard"
                        hx-target="#main-content"
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Admin Panel
                </button>
                {{/admin}}
                {{/user.role}}
            </div>
            
            <div id="main-content" class="mt-6"></div>
        </div>
    </div>

    <!-- HTMX Configuration -->
    <script>
        // Configure HTMX
        htmx.config.defaultSwapStyle = 'innerHTML';
        htmx.config.defaultSwapDelay = 100;
        
        // Add loading indicators
        document.body.addEventListener('htmx:beforeRequest', function(e) {
            e.target.classList.add('opacity-50');
        });
        
        document.body.addEventListener('htmx:afterRequest', function(e) {
            e.target.classList.remove('opacity-50');
        });
    </script>
</body>
</html>
```

## Flow Structure

```
[HTTP In: GET /dashboard] 
    ↓
[Prepare User Dashboard Data] (TypeScript Function)
    ↓  
[User Dashboard Template] (TypeScript Template) 
    ↓
[HTTP Response]
```

## Key Benefits

1. **Complete Type Safety**: TypeScript validates data structure from function to template
2. **Runtime Validation**: Template node validates payload matches interface at runtime  
3. **Shared Interfaces**: Same types used across multiple nodes
4. **IntelliSense**: Template editor provides autocomplete for interface properties
5. **Error Prevention**: Compilation errors prevent deployment of invalid code
6. **Maintainability**: Interface changes propagate across all nodes

## Error Handling

### Compilation Errors
If the interface doesn't exist or has errors:
- Template node shows red status
- Deploy is prevented
- Detailed error messages in debug panel

### Runtime Validation Errors  
If payload doesn't match interface:
- Template node logs validation errors
- Message processing stops
- Specific error details provided

### Template Rendering Errors
If template syntax is invalid:
- Error logged with line numbers
- Message processing stops
- Original message preserved

## Advanced Patterns

### Multiple Output Templates
```typescript
// Function returns different interfaces for different outputs
export default function(msg: NodeMessage): [NodeMessage, NodeMessage] {
    return [
        { ...msg, payload: dashboardData },      // Output 0: Dashboard
        { ...msg, payload: summaryData }         // Output 1: Summary  
    ];
}
```

### Conditional Interface Selection
```typescript
// Function chooses interface based on user role
export default function(msg: NodeMessage): NodeMessage {
    if (msg.userRole === 'admin') {
        const adminData: AdminDashboardData = { /* ... */ };
        return { ...msg, payload: adminData };
    } else {
        const userData: UserDashboardData = { /* ... */ };
        return { ...msg, payload: userData };
    }
}
```

This workflow provides complete type safety from data preparation to HTML rendering, making your Node-RED flows more reliable and maintainable! 