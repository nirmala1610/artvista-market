import React, { useState, useEffect } from "react";
import SideBar from "./CuratorSideBar";
import CollectionsSection from "../../components/CollectionsSection";
import { uploadToCloudinary } from "../../util/cloudinaryUpload";

const CurationStudio = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false); // Distinct state to avoid locking the entire page layout
  
  // Modal visibility states
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  
  // Tracking selected items
  const [selectedExhibitionId, setSelectedExhibitionId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const BASE_URL = "http://localhost:8080/api/exhibitions";
  // --- API Handlers ---

  const fetchExhibitions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/fetch`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch exhibitions");
      const data = await res.json();
      setExhibitions([...data].reverse());
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExhibitionId) return;
    try {
      const res = await fetch(`${BASE_URL}/${selectedExhibitionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      
      setDeleteModal(false);
      setSelectedExhibitionId(null);
      fetchExhibitions();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/${editFormData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) throw new Error("Update failed");

      setEditModal(false);
      fetchExhibitions();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // --- Cloudinary Native Upload Logic ---
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      
      setEditFormData((prev) => ({
        ...prev,
        bannerUrl: imageUrl,
      }));
      console.log("Banner uploaded successfully:", imageUrl);
    } catch (error) {
       console.error("Banner upload failed", error);
    } finally {
      setUploadingImage(false);
    }
  };

  // --- Modal Trigger Triggers ---

  const openDeleteModal = (id) => {
    setSelectedExhibitionId(id);
    setDeleteModal(true);
  };

  const openEditModal = (exhibition) => {
    setEditFormData({ ...exhibition });
    setEditModal(true);
  };

  // --- Form Input Field Tracker ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070B] flex flex-col gap-4 items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <p className="text-gray-400 text-lg font-medium">Loading studio instances...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070B] flex text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-[600px] h-[600px] bg-blue-600/5 blur-[200px] rounded-full pointer-events-none" />

      <SideBar />

      <div className="flex-1 p-10 z-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Curation Studio
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your premium digital exhibitions, monitor metrics, and adjust operational structures.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-200 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block"></span>
            Active Exhibition
          </h2>
          <CollectionsSection 
            exhibitions={exhibitions} 
            onDelete={openDeleteModal} 
            onEdit={openEditModal} 
          />
        </div>
      </div>

      {/* --- MODAL: EDIT EXHIBITION DETAILS --- */}
      {editModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-[#0A0F18]/95 border border-white/10 rounded-[24px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-500 to-blue-500" />
            
            <h2 className="text-2xl font-bold text-white mb-6">Modify Exhibition Details</h2>

            <form onSubmit={handleUpdate} className="space-y-5 text-sm">
              {/* Row 1: Title & Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Title</label>
                  <input type="text" name="title" value={editFormData.title || ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400" required />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Theme Name</label>
                  <input type="text" name="themeName" value={editFormData.themeName || ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400" />
                </div>
              </div>

              {/* Row 2: Category & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <input type="text" name="category" value={editFormData.category || ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Visibility</label>
                  <select name="visibility" value={editFormData.visibility || "PUBLIC"} onChange={handleInputChange} className="w-full bg-[#0A0F18] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400">
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Status</label>
                  <select name="status" value={editFormData.status || "UPCOMING"} onChange={handleInputChange} className="w-full bg-[#0A0F18] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400">
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAST">Past</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea name="description" value={editFormData.description || ""} onChange={handleInputChange} rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 resize-none" />
              </div>

              {/* Row 4: Dates & Times */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Start Date</label>
                  <input type="date" name="startDate" value={editFormData.startDate || ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">End Date</label>
                  <input type="date" name="endDate" value={editFormData.endDate || ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Open Time</label>
                  <input type="time" name="openTime" value={editFormData.openTime || ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Close Time</label>
                  <input type="time" name="closeTime" value={editFormData.closeTime || ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400" />
                </div>
              </div>

              {/* Row 5: Financial Metrics & Operations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div className="flex items-center gap-2 pb-3">
                  <input type="checkbox" id="isPaid" name="isPaid" checked={!!editFormData.isPaid} onChange={handleInputChange} className="accent-cyan-400 h-4 w-4" />
                  <label htmlFor="isPaid" className="text-gray-400 select-none">Paid Event</label>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Regular Price ($)</label>
                  <input type="number" step="0.01" name="ticketPrice" value={editFormData.ticketPrice ?? ""} onChange={handleInputChange} disabled={!editFormData.isPaid} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 disabled:opacity-30" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">VIP Price ($)</label>
                  <input type="number" step="0.01" name="vipPrice" value={editFormData.vipPrice ?? ""} onChange={handleInputChange} disabled={!editFormData.isPaid} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 disabled:opacity-30" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Max Visitors</label>
                  <input type="number" name="maxVisitors" value={editFormData.maxVisitors ?? ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400" />
                </div>
              </div>

              {/* Row 6: Enhanced Cloudinary Upload Form Control */}
              <div>
                <label className="block text-gray-400 mb-2">Exhibition Banner Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                  {editFormData.bannerUrl ? (
                    <img 
                      src={editFormData.bannerUrl} 
                      alt="Banner Preview" 
                      className="w-full sm:w-32 h-20 object-cover rounded-xl border border-white/10 bg-black"
                    />
                  ) : (
                    <div className="w-full sm:w-32 h-20 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  
                  <div className="flex-1 w-full">
                    <label className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium cursor-pointer transition text-xs disabled:opacity-50">
                      {uploadingImage ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          Uploading to Cloudinary...
                        </span>
                      ) : (
                        "Choose New Image"
                      )}
                      <input s
                        type="file" 
                        accept="image/*" 
                        onChange={handleBannerUpload} 
                        disabled={uploadingImage}
                        className="hidden" 
                      />
                    </label>
                    <p className="text-gray-500 text-xs mt-1.5">Supports PNG, JPG or WebP images.</p>
                  </div>
                </div>
              </div>

              {/* Control Action Elements */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setEditModal(false)} className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition border border-white/5">
                  Cancel
                </button>
                <button type="submit" 
                onClick={handleUpdate}
                disabled={uploadingImage} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 font-semibold text-white transition shadow-lg shadow-cyan-500/10 disabled:opacity-50">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: DELETE CONFIRMATION --- */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-[#0A0F18]/90 border border-white/10 rounded-[32px] p-8 w-[440px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-red-500 to-amber-500" />
            
            <h2 className="text-2xl font-bold text-white mb-3 font-sans">Discard Exhibition?</h2>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm">
              Are you sure you want to delete this exhibition entry? This operation permanently removes raw data sets and cannot be reversed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModal(false);
                  setSelectedExhibitionId(null);
                }}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition text-sm border border-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-semibold text-white transition text-sm shadow-lg shadow-red-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurationStudio;