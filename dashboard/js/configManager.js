// Configuration Manager for centralized settings management
export const DEFAULT_SETTINGS = {
  selector: { incomming: 1, outgoing: 1 },
  showBoundingBox: true,
  zoomToRoot: true,
  toggleCollapseOnStatusChange: false,
  cascadeOnStatusChange: true,
  showCenterMark: false,
  showConnectionPoints: false,
  containerMargin: { top: 8, right: 8, bottom: 8, left: 8 },
  nodeSpacing: { horizontal: 20, vertical: 10 }
};

export class ConfigManager {
  static mergeWithDefaults(userSettings) {
    return this.deepMerge(DEFAULT_SETTINGS, userSettings);
  }
  
  static deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  static validateSettings(settings) {
    const errors = [];
    
    if (settings.selector && (settings.selector.incomming < 0 || settings.selector.outgoing < 0)) {
      errors.push("Selector values must be non-negative");
    }
    
    if (settings.containerMargin) {
      const margins = ['top', 'right', 'bottom', 'left'];
      margins.forEach(margin => {
        if (settings.containerMargin[margin] < 0) {
          errors.push(`Container margin ${margin} must be non-negative`);
        }
      });
    }
    
    if (settings.nodeSpacing) {
      if (settings.nodeSpacing.horizontal < 0 || settings.nodeSpacing.vertical < 0) {
        errors.push("Node spacing values must be non-negative");
      }
    }
    
    return errors;
  }
  
  static getDefaultContainerMargin() {
    return { ...DEFAULT_SETTINGS.containerMargin };
  }
  
  static getDefaultNodeSpacing() {
    return { ...DEFAULT_SETTINGS.nodeSpacing };
  }
} 