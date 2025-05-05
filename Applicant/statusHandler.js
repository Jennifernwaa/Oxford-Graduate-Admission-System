// statusHandler.js
export function handleStatus(status) {
    switch (status) {
      case 'Submitted':
      case 'Reviewed':
      case 'Additional Documents Requested':
      case 'Rejected':
      case 'Approved':
        return {
          displayStatus: status,
          statusClass: `application-status ${status.toLowerCase().replace(" ", "-")}`
        };
      default:
        return {
          displayStatus: 'In Progress',
          statusClass: 'application-status in-progress'
        };
    }
  }
  