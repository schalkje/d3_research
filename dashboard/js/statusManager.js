import { NodeStatus } from "./nodeBase.js";

// Status Manager for centralized status calculation and management
export class StatusManager {
  static calculateContainerStatus(childNodes, settings) {
    if (!settings.cascadeOnStatusChange || childNodes.length === 0) {
      return NodeStatus.UNKNOWN;
    }

    const collectLeafStatuses = (nodes, out) => {
      for (const n of nodes) {
        if (n.isContainer && Array.isArray(n.childNodes) && n.childNodes.length > 0) {
          collectLeafStatuses(n.childNodes, out);
        } else {
          out.push(n.status);
        }
      }
    };

    const statuses = [];
    collectLeafStatuses(childNodes, statuses);
    return this.determineAggregateStatus(statuses);
  }
  
  static determineAggregateStatus(statuses) {
    if (statuses.length === 0) {
      return NodeStatus.UNKNOWN;
    }
    
    // Priority order: Error > Warning > Delayed > Unknown > Updating > Updated > Skipped > Ready
    const priority = [
      NodeStatus.ERROR,
      NodeStatus.WARNING,
      NodeStatus.DELAYED,
      NodeStatus.UNKNOWN,
      NodeStatus.UPDATING,
      NodeStatus.UPDATED,
      NodeStatus.SKIPPED,
      NodeStatus.READY
    ];
    
    for (const status of priority) {
      if (statuses.includes(status)) {
        return status;
      }
    }
    
    return NodeStatus.UNKNOWN;
  }
  
  static shouldCollapseOnStatus(status, settings) {
    if (!settings.toggleCollapseOnStatusChange) {
      return false;
    }
    
    return [NodeStatus.READY, NodeStatus.DISABLED, NodeStatus.UPDATED, NodeStatus.SKIPPED].includes(status);
  }
  
  static getStatusPriority(status) {
    const priority = [
      NodeStatus.ERROR,
      NodeStatus.WARNING,
      NodeStatus.DELAYED,
      NodeStatus.UNKNOWN,
      NodeStatus.UPDATING,
      NodeStatus.UPDATED,
      NodeStatus.SKIPPED,
      NodeStatus.READY
    ];
    
    return priority.indexOf(status);
  }
  
  static isErrorStatus(status) {
    return [NodeStatus.ERROR, NodeStatus.WARNING, NodeStatus.DELAYED].includes(status);
  }
  
  static isProcessStatus(status) {
    return [NodeStatus.READY, NodeStatus.UPDATING, NodeStatus.UPDATED, NodeStatus.SKIPPED].includes(status);
  }
} 