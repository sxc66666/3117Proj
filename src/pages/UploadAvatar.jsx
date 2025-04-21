// src/pages/UploadAvatar.jsx
import React, { useState } from "react";
import axiosInstance from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const res = await axiosInstance.post("/api/profile_image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Ensure JWT cookie is sent
      });

      setMessage("Upload successful!");
      // Redirect after successful upload, e.g., to the homepage or profile page
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4 text-center">Please upload a new avatar</h2>
        {message && <div className="text-center text-red-500 mb-4">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Upload Avatar
          </button>
        </form>
      </div>
    </div>
  );
}
