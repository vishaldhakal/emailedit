// Service for campaign images interacting with our S3/Spaces proxy API
export const campaignImagesService = {
  list: async (userId) => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      
      const res = await fetch(`/api/images?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch images");
      }
      return await res.json();
    } catch (error) {
      console.error("Error listing images:", error);
      throw error;
    }
  },

  uploadFile: async (file, name, userId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (userId) formData.append("userId", userId);

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to upload image");
      }

      return await res.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  saveLink: async (link, name, userId) => {
    // For pure links, we can either just return the object or maybe we want to
    // "sideload" it to our bucket? For now, the previous implementation just
    // returned a mock object. We'll keep it simple and just return the structured object.
    // If we wanted to track these in DB, we'd call an API.
    // Since we are listing from bucket, links won't show up in "Gallery" unless we
    // actually upload them or have a DB record.
    // For this task, we'll assume "Gallery" means "Uploaded to Spaces".
    // "Link" is just for using an external URL directly in the email.
    
    return {
      id: Math.random().toString(36).substring(7),
      url: link,
      name: name || "Link Image",
      isExternal: true
    };
  }
};
