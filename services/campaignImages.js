// Mock service for campaign images
export const campaignImagesService = {
  list: async (userId) => {
    // Return empty list or mock data
    return []; 
  },
  uploadFile: async (file, name, userId) => {
    // Mock upload - typically returns an object with url
    return {
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file), // Use object URL for local preview
      name: name
    };
  },
  saveLink: async (link, name, userId) => {
     return {
      id: Math.random().toString(36).substring(7),
      url: link,
      name: name || "Link Image"
    };
  }
};
