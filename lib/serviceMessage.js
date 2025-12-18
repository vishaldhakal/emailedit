export const service_message = (message, type = "info") => {
  console.log(`[Service Message] ${type.toUpperCase()}: ${message}`);
  // You can integrate a toast library here later, e.g., sonner or react-hot-toast
  // toast[type](message);
};

export const hookEvent = (eventName, data = {}) => {
  console.log(`[Hook Event] ${eventName}`, data);
  // You can integrate analytics logic here
};
