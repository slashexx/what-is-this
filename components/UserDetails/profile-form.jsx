'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { LinkIcon, TrashIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export function ProfileForm({ user, onUpdateProfile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    userId: user?.userId || "",
    subscription: user?.subscription || "free",
    apiKey: user?.apiKey || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onUpdateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="relative">
          <img
            src="https://picsum.photos/seed/profile123/800/400"
            alt="Profile Banner"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <button className="p-2 bg-white rounded-full">
              <LinkIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-full">
              <TrashIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#F3EAE7]"
            placeholder="Full Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#F3EAE7]"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">User ID</label>
          <Input
            name="userId"
            value={formData.userId}
            className="w-full bg-[#F3EAE7]"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subscription</label>
          <Input
            name="subscription"
            value={formData.subscription}
            onChange={handleChange}
            className="w-full bg-[#F3EAE7]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <Input
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            className="w-full bg-[#F3EAE7]"
          />
        </div>

        <div className="mt-4">
          <button 
            type="submit" 
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
