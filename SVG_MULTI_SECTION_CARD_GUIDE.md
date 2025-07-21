# 🎨 Multi-Section SVG Card System Guide

## ✅ **What We've Built**

A **modern multi-section card** system using pure SVG that gives you:
- **🎯 Elevated card design** with drop shadows
- **📊 Multi-section layout** (header + main + expandable)
- **🏷️ Color-coded badges** by node type
- **⚡ Fast performance** - pure SVG, no position sync issues
- **🎮 Full interactivity** - drag, click, connect work perfectly

## 🏗️ **Card Architecture**

```
┌─────────────────────────────────────────┐
│  Header Section (gray background)       │  ← Badge + Status Dot
│  ┌─────────┐                     ●     │
│  │  GET    │                           │
│  └─────────┘                           │
├─────────────────────────────────────────┤
│                                         │
│        Main Section                     │  ← Node name + content
│      (white background)                 │
│                                         │
└─────────────────────────────────────────┘
         ↑ Drop shadow behind
```

## 📍 **Where to Modify**

### **Main File**: `packages/node_modules/@node-red/editor-client/src/js/ui/view.js`
### **CSS File**: `packages/node_modules/@node-red/editor-client/src/sass/flow.scss`

### **Key Section**: Look for `// ===== MULTI-SECTION SVG CARD =====` around line 4720

## 🔧 **Current Sections**

### **1. Card Shadow (Elevation)**
```javascript
// 1. CARD SHADOW (for elevation)
var shadowRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
shadowRect.setAttribute("fill", "rgba(0,0,0,0.1)");
shadowRect.setAttribute("x", 2);
shadowRect.setAttribute("y", 2);
```

### **2. Main Card Background**
```javascript
// 2. MAIN CARD BACKGROUND
var mainRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
mainRect.setAttribute("fill", "#ffffff");
mainRect.setAttribute("stroke", "#e5e7eb");
```

### **3. Header Section**
```javascript
// 3. HEADER SECTION
var headerRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
headerRect.setAttribute("fill", "#f8fafc");
headerRect.setAttribute("height", "20");
```

### **4. Header Border**
```javascript
// 4. HEADER BOTTOM BORDER
var headerBorder = document.createElementNS("http://www.w3.org/2000/svg","line");
headerBorder.setAttribute("y1", "20");
headerBorder.setAttribute("y2", "20");
```

### **5. Type Badge**
```javascript
// 5. NODE TYPE BADGE
var badgeRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
badgeRect.setAttribute("fill", badgeInfo.color);
badgeRect.setAttribute("width", 40);
badgeRect.setAttribute("height", 12);
```

### **6. Status Indicator**
```javascript
// 6. STATUS INDICATOR
var statusDot = document.createElementNS("http://www.w3.org/2000/svg","circle");
statusDot.setAttribute("fill", "#22c55e");
statusDot.setAttribute("r", 3);
```

### **7. Main Section Text**
```javascript
// 7. MAIN SECTION TEXT (positioned below header)
var text = document.createElementNS("http://www.w3.org/2000/svg","g");
text.setAttribute("transform","translate(8,35)");
```

## 🎯 **How to Add New Sections**

### **Example: Add a Footer Section**

Add this after the status indicator (around line 4800):

```javascript
// 8. FOOTER SECTION
var footerRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
footerRect.__data__ = d;
footerRect.setAttribute("class", "red-ui-flow-node-footer");
footerRect.setAttribute("fill", "#f1f5f9");
footerRect.setAttribute("y", d.h - 15);
footerRect.setAttribute("height", "15");
footerRect.setAttribute("rx", 0);
footerRect.setAttribute("ry", 0);
footerRect.style["pointer-events"] = "none";
node[0][0].__footerRect__ = footerRect;
nodeContents.appendChild(footerRect);

// Footer text
var footerText = document.createElementNS("http://www.w3.org/2000/svg","text");
footerText.setAttribute("x", 8);
footerText.setAttribute("y", d.h - 7);
footerText.setAttribute("font-size", "8");
footerText.setAttribute("fill", "#64748b");
footerText.textContent = "v1.0.0";
footerText.style["pointer-events"] = "none";
node[0][0].__footerText__ = footerText;
nodeContents.appendChild(footerText);
```

### **Example: Add a Progress Bar**

```javascript
// 9. PROGRESS BAR
var progressBg = document.createElementNS("http://www.w3.org/2000/svg","rect");
progressBg.setAttribute("x", 8);
progressBg.setAttribute("y", d.h - 25);
progressBg.setAttribute("width", d.w - 16);
progressBg.setAttribute("height", 4);
progressBg.setAttribute("fill", "#e5e7eb");
progressBg.setAttribute("rx", 2);
node[0][0].__progressBg__ = progressBg;
nodeContents.appendChild(progressBg);

var progressBar = document.createElementNS("http://www.w3.org/2000/svg","rect");
progressBar.setAttribute("x", 8);
progressBar.setAttribute("y", d.h - 25);
progressBar.setAttribute("width", (d.w - 16) * 0.7); // 70% progress
progressBar.setAttribute("height", 4);
progressBar.setAttribute("fill", "#3b82f6");
progressBar.setAttribute("rx", 2);
node[0][0].__progressBar__ = progressBar;
nodeContents.appendChild(progressBar);
```

### **Example: Add Icon Section**

```javascript
// 10. ICON SECTION
var iconBg = document.createElementNS("http://www.w3.org/2000/svg","circle");
iconBg.setAttribute("cx", d.w - 20);
iconBg.setAttribute("cy", 35);
iconBg.setAttribute("r", 12);
iconBg.setAttribute("fill", "#dbeafe");
iconBg.setAttribute("stroke", "#3b82f6");
iconBg.setAttribute("stroke-width", 1);
node[0][0].__iconBg__ = iconBg;
nodeContents.appendChild(iconBg);

var iconText = document.createElementNS("http://www.w3.org/2000/svg","text");
iconText.setAttribute("x", d.w - 20);
iconText.setAttribute("y", 35);
iconText.setAttribute("font-size", "12");
iconText.setAttribute("fill", "#3b82f6");
iconText.setAttribute("text-anchor", "middle");
iconText.setAttribute("dominant-baseline", "middle");
iconText.textContent = "⚡";
node[0][0].__iconText__ = iconText;
nodeContents.appendChild(iconText);
```

## 🔄 **Update Sizing in Redraw Function**

When you add new sections, **don't forget** to update their dimensions in the redraw function around line 4870:

```javascript
// Update your new section dimensions
if (this.__footerRect__) {
    this.__footerRect__.setAttribute("width", d.w);
    this.__footerRect__.setAttribute("y", d.h - 15);
}

if (this.__progressBg__) {
    this.__progressBg__.setAttribute("width", d.w - 16);
}

if (this.__progressBar__) {
    this.__progressBar__.setAttribute("width", (d.w - 16) * 0.7);
}

if (this.__iconBg__) {
    this.__iconBg__.setAttribute("cx", d.w - 20);
}

if (this.__iconText__) {
    this.__iconText__.setAttribute("x", d.w - 20);
}
```

## 🎨 **Customization Examples**

### **Change Badge Colors**
```javascript
// In getNodeBadgeInfo function (around line 4760)
'your-node-type': { text: 'CUSTOM', color: '#ec4899' }, // Pink badge
```

### **Change Section Colors**
```javascript
// Change header background
headerRect.setAttribute("fill", "#eff6ff"); // Light blue

// Change shadow opacity
shadowRect.setAttribute("fill", "rgba(0,0,0,0.2)"); // Darker shadow
```

### **Add Hover Effects**
```javascript
// Add hover class to main rect
d3.select(mainRect)
    .on("mouseover", function() {
        d3.select(this).classed("red-ui-flow-node-hovered", true);
    })
    .on("mouseout", function() {
        d3.select(this).classed("red-ui-flow-node-hovered", false);
    });
```

## 🎯 **CSS Styling (flow.scss)**

Add styles for your new sections:

```scss
.red-ui-flow-node-footer {
    fill: #f1f5f9;
    pointer-events: none;
}

.red-ui-flow-node-progress-bg {
    fill: #e5e7eb;
    pointer-events: none;
}

.red-ui-flow-node-progress-bar {
    fill: #3b82f6;
    pointer-events: none;
    transition: width 0.3s ease;
}

.red-ui-flow-node-hovered {
    .red-ui-flow-node-shadow {
        fill: rgba(0, 0, 0, 0.2);
    }
}
```

## 📊 **Current Node Types & Colors**

| Node Type | Badge Text | Color |
|-----------|------------|-------|
| http request | GET | Green `#10b981` |
| http in | POST | Blue `#3b82f6` |
| http response | RESP | Indigo `#6366f1` |
| function | FUNC | Purple `#8b5cf6` |
| inject | START | Red `#ef4444` |
| debug | DEBUG | Orange `#f97316` |
| change | EDIT | Cyan `#06b6d4` |
| switch | SWITCH | Lime `#84cc16` |
| template | TMPL | Purple `#a855f7` |
| delay | DELAY | Yellow `#eab308` |

## 🚀 **Benefits of This Approach**

### ✅ **Advantages**
- **Performance**: Pure SVG, no HTML sync issues
- **Flexibility**: Easy to add/remove sections
- **Consistency**: All sections scale together
- **Maintainability**: Clear structure with numbered sections
- **Customization**: Easy to modify colors, sizes, positions

### 🎯 **Best Practices**
1. **Always add new sections** after existing ones
2. **Store references** as `node[0][0].__yourSection__`
3. **Update dimensions** in the redraw function
4. **Use pointer-events: none** for decorative elements
5. **Keep consistent naming** with double underscores

## 🔧 **Quick Development Tips**

1. **Test sections individually** - comment out others to focus on one
2. **Use browser dev tools** - inspect the SVG structure
3. **Consistent positioning** - use the same margins/padding system
4. **Color variables** - define colors in one place for easy changes
5. **Performance** - avoid complex animations on many nodes

**Your nodes are now modern, multi-section cards with unlimited customization potential!** 🎨 