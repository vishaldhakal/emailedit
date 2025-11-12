"use client";

import { useState, useEffect } from "react";
import { useFooterSettings } from "@/hooks/useCampaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Settings, X } from "lucide-react";
import { toast } from "sonner";

export function FooterSettingsModal({ isOpen, onClose }) {
  const { footerSettings, isLoading, updateFooterSettings, isUpdating } =
    useFooterSettings();

  const [formData, setFormData] = useState({
    custom_html: "",
    company_name: "",
    company_address: "",
    company_phone: "",
    company_email: "",
    company_website: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    linkedin_url: "",
    youtube_url: "",
    tiktok_url: "",
    text_color: "#666666",
    background_color: "#f5f5f5",
    font_size: "12px",
    alignment: "center",
    show_unsubscribe_link: true,
    unsubscribe_text: "Unsubscribe",
    privacy_policy_url: "",
    terms_of_service_url: "",
  });

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen && footerSettings) {
      setFormData({
        custom_html: footerSettings.custom_html || "",
        company_name: footerSettings.company_name || "",
        company_address: footerSettings.company_address || "",
        company_phone: footerSettings.company_phone || "",
        company_email: footerSettings.company_email || "",
        company_website: footerSettings.company_website || "",
        facebook_url: footerSettings.facebook_url || "",
        twitter_url: footerSettings.twitter_url || "",
        instagram_url: footerSettings.instagram_url || "",
        linkedin_url: footerSettings.linkedin_url || "",
        youtube_url: footerSettings.youtube_url || "",
        tiktok_url: footerSettings.tiktok_url || "",
        text_color: footerSettings.text_color || "#666666",
        background_color: footerSettings.background_color || "#f5f5f5",
        font_size: footerSettings.font_size || "12px",
        alignment: footerSettings.alignment || "center",
        show_unsubscribe_link:
          footerSettings.show_unsubscribe_link !== undefined
            ? footerSettings.show_unsubscribe_link
            : true,
        unsubscribe_text: footerSettings.unsubscribe_text || "Unsubscribe",
        privacy_policy_url: footerSettings.privacy_policy_url || "",
        terms_of_service_url: footerSettings.terms_of_service_url || "",
      });
    }
  }, [isOpen, footerSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFooterSettings(formData);
      toast.success("Footer settings saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving footer settings:", error);
      toast.error(error.message || "Failed to save footer settings");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="bg-white shadow-xl rounded-2xl w-full max-w-2xl mx-4 relative flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 pb-0">
            <button
              className="absolute top-2 right-2 text-black hover:text-gray-600 hover:bg-gray-100 rounded-full p-1"
              onClick={onClose}
            >
              <X className="h-4 w-4 sm:h-7 sm:w-7" />
            </button>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-700" />
              <h2 className="text-xl font-semibold">Footer Settings</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="p-4 overflow-y-auto h-[520px]">
                <div className="space-y-8">
                  {/* Custom HTML Footer (preferred) */}
                  <div className="space-y-3">
                    <h3 className="text-md font-semibold text-black">
                      Footer Content (HTML)
                    </h3>
                    <p className="text-xs text-gray-600">
                      This HTML will be used as your footer across campaigns.
                      You can include links; the unsubscribe link placeholder{" "}
                      {"{{unsubscribe_url}}"} will be auto-filled.
                    </p>
                    <Textarea
                      value={formData.custom_html}
                      onChange={(e) =>
                        handleChange("custom_html", e.target.value)
                      }
                      rows={10}
                      className="min-h-[160px] font-mono text-xs"
                      placeholder="<p>Type your footer HTML here...</p>"
                    />
                    {!footerSettings?.custom_html && (
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleChange(
                              "custom_html",
                              `<p><strong>Important Notice:</strong> This message is intended only for the use of the individual or entity to which it is addressed. The message may contain information that is privileged, confidential and exempt from disclosure under applicable law. Not intended to solicit buyers or sellers currently under contract.</p>
<p>Copyright © Elixir Real Estate Brokerage, All rights reserved.</p>
<p>The trademarks REALTOR®, REALTORS®, and the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and identify real estate professionals who are members of CREA. Used under license.</p>
<p>Want to change how you receive these emails?<br/>
You can <a href="{{unsubscribe_url}}" style="color:#2563eb; text-decoration:underline;">update your preferences</a> or <a href="{{unsubscribe_url}}" style="color:#2563eb; text-decoration:underline;">unsubscribe</a>.</p>`
                            )
                          }
                          className="h-8"
                        >
                          Use recommended footer
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Company Information */}
                  <div className="space-y-3">
                    <h3 className="text-md font-semibold text-black">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={formData.company_name}
                        onChange={(e) =>
                          handleChange("company_name", e.target.value)
                        }
                        label="Company Name"
                      />
                      <Input
                        value={formData.company_phone}
                        onChange={(e) =>
                          handleChange("company_phone", e.target.value)
                        }
                        label="Phone"
                      />
                    </div>
                    <Textarea
                      value={formData.company_address}
                      onChange={(e) =>
                        handleChange("company_address", e.target.value)
                      }
                      label="Address"
                      rows={2}
                      className="min-h-[60px]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="email"
                        value={formData.company_email}
                        onChange={(e) =>
                          handleChange("company_email", e.target.value)
                        }
                        label="Email"
                      />
                      <Input
                        type="url"
                        value={formData.company_website}
                        onChange={(e) =>
                          handleChange("company_website", e.target.value)
                        }
                        label="Website"
                      />
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Social Media
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="url"
                        value={formData.facebook_url}
                        onChange={(e) =>
                          handleChange("facebook_url", e.target.value)
                        }
                        label="Facebook URL"
                      />
                      <Input
                        type="url"
                        value={formData.twitter_url}
                        onChange={(e) =>
                          handleChange("twitter_url", e.target.value)
                        }
                        label="Twitter URL"
                      />
                      <Input
                        type="url"
                        value={formData.instagram_url}
                        onChange={(e) =>
                          handleChange("instagram_url", e.target.value)
                        }
                        label="Instagram URL"
                      />
                      <Input
                        type="url"
                        value={formData.linkedin_url}
                        onChange={(e) =>
                          handleChange("linkedin_url", e.target.value)
                        }
                        label="LinkedIn URL"
                      />
                      <Input
                        type="url"
                        value={formData.youtube_url}
                        onChange={(e) =>
                          handleChange("youtube_url", e.target.value)
                        }
                        label="YouTube URL"
                      />
                      <Input
                        type="url"
                        value={formData.tiktok_url}
                        onChange={(e) =>
                          handleChange("tiktok_url", e.target.value)
                        }
                        label="TikTok URL"
                      />
                    </div>
                  </div>

                  {/* Styling */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Styling
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700">
                          Text Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={formData.text_color}
                            onChange={(e) =>
                              handleChange("text_color", e.target.value)
                            }
                            className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={formData.text_color}
                            onChange={(e) =>
                              handleChange("text_color", e.target.value)
                            }
                            label="Hex Code"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700">
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={formData.background_color}
                            onChange={(e) =>
                              handleChange("background_color", e.target.value)
                            }
                            className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={formData.background_color}
                            onChange={(e) =>
                              handleChange("background_color", e.target.value)
                            }
                            label="Hex Code"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <Input
                        value={formData.font_size}
                        onChange={(e) =>
                          handleChange("font_size", e.target.value)
                        }
                        label="Font Size"
                      />
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700">
                          Alignment
                        </label>
                        <select
                          value={formData.alignment}
                          onChange={(e) =>
                            handleChange("alignment", e.target.value)
                          }
                          className="flex h-12 w-full rounded-lg border border-input bg-white/80 px-4 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Legal Links */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Legal & Unsubscribe
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="show_unsubscribe_link"
                          checked={formData.show_unsubscribe_link}
                          onChange={(e) =>
                            handleChange(
                              "show_unsubscribe_link",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <label
                          htmlFor="show_unsubscribe_link"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Show unsubscribe link
                        </label>
                      </div>
                      {formData.show_unsubscribe_link && (
                        <Input
                          value={formData.unsubscribe_text}
                          onChange={(e) =>
                            handleChange("unsubscribe_text", e.target.value)
                          }
                          label="Unsubscribe Text"
                        />
                      )}
                      <Input
                        type="url"
                        value={formData.privacy_policy_url}
                        onChange={(e) =>
                          handleChange("privacy_policy_url", e.target.value)
                        }
                        label="Privacy Policy URL"
                      />
                      <Input
                        type="url"
                        value={formData.terms_of_service_url}
                        onChange={(e) =>
                          handleChange("terms_of_service_url", e.target.value)
                        }
                        label="Terms of Service URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white rounded-b-2xl p-4 flex justify-end space-x-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
                className="px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </span>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
