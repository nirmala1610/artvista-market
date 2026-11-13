import React, { useState } from "react";
import SideBar from "./CuratorSideBar";

import { toast } from "sonner";
import { uploadToCloudinary } from "../../util/cloudinaryUpload";
import ExhibitionStepper from "../../components/ExhibitionStepper";
import BasicInfoStep from "../../components/BasicInfoStep";
import ScheduleStep from "../../components/ScheduleStep";
import TicketStep from "../../components/TicketStep";
import ArtistStep from "../../components/ArtistStep";
import PreviewCard from "../../components/PreviewCard";

const ExhibitionManagement = () => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    themeName: "",
    category: "Digital Art",
    description: "",
    startDate: "",
    endDate: "",
    openTime: "",
    closeTime: "",
    visibility: "PUBLIC",
    status: "UPCOMING",
    isPaid: false,
    ticketPrice: "",
    vipPrice: "",
    maxVisitors: 100,
    banner: null,
    bannerUrl: "",
    selectedArtists: [],
    locationId: "", 
    location: ""    
  });

  // Make validateStep ASYNC to handle live database checking
  const validateStep = async () => {
    let temp = {};

    if (step === 0) {
      if (!formData.title.trim()) temp.title = "Title required";
      if (formData.description.length < 20)
        temp.description = "Description must be at least 20 characters";
      if (!formData.locationId) 
        temp.location = "You must select an available exhibition address";
    }

    if (step === 1) {
      if (!formData.startDate) temp.startDate = "Start date required";
      if (!formData.endDate) temp.endDate = "End date required";

      if (
        formData.startDate &&
        formData.endDate &&
        new Date(formData.startDate) > new Date(formData.endDate)
      ) {
        temp.endDate = "End date must be after start date";
      }

      if (formData.startDate && formData.endDate && formData.locationId && !temp.endDate) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/exhibitions/check-availability?locationId=${formData.locationId}&startDate=${formData.startDate}&endDate=${formData.endDate}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const isAvailable = await response.json(); // Backend returns true or false

          if (!isAvailable) {
            temp.startDate = "This venue is already booked by another exhibition during these dates.";
          }
        } catch (error) {
          console.error("Failed to verify venue availability:", error);
        }
      }
    }

    if (step === 2) {
      if (formData.isPaid && !formData.ticketPrice) {
        temp.ticketPrice = "Ticket price required";
      }
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Convert nextStep into an async call
  const nextStep = async () => {
    const isValid = await validateStep();
    if (!isValid) return;
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        banner: file,
        bannerUrl: imageUrl,
      }));
      toast.success("Banner uploaded");
    } catch (error) {
       toast.error("Banner upload failed");
    } finally {
      setLoading(false);
    }
  };

  const submitExhibition = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        themeName: formData.themeName,
        category: formData.category,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        visibility: formData.visibility,
        status: formData.status,
        isPaid: formData.isPaid,
        ticketPrice: formData.ticketPrice || 0,
        vipPrice: formData.vipPrice || 0,
        maxVisitors: formData.maxVisitors,
        bannerUrl: formData.bannerUrl,
        selectedArtists: formData.selectedArtists,
        locationId: formData.locationId, // Ensure ID is saved
        location: formData.location 
      };

      const response = await fetch(
        "http://localhost:8080/api/exhibitions/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed");
      }

      toast.success("Exhibition created successfully!");

      setFormData({
        title: "", themeName: "", category: "Digital Art", description: "",
        startDate: "", endDate: "", openTime: "", closeTime: "",
        visibility: "PUBLIC", status: "UPCOMING", isPaid: false,
        ticketPrice: "", vipPrice: "", maxVisitors: 100, banner: null,
        bannerUrl: "", selectedArtists: [], locationId: "", location: ""
      });

      setStep(0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <BasicInfoStep formData={formData} setFormData={setFormData} errors={errors} />
            <div className="mt-6">
              <label className="block mb-3 text-gray-300">Upload Banner</label>
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="w-full bg-[#0D1117] p-4 rounded-2xl" />
            </div>
          </>
        );
      case 1:
        return <ScheduleStep formData={formData} setFormData={setFormData} errors={errors} />; // Pass errors to show timeline blockages
      case 2:
        return <TicketStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <ArtistStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <PreviewCard formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      <SideBar />

      <div className="flex-1 p-10 z-10 overflow-y-auto">
        <h1 className="text-5xl font-black mb-3">Exhibition Registration</h1>
        <p className="text-gray-400 mb-8">Create premium digital exhibitions for ArtVista</p>

        <ExhibitionStepper currentStep={step} />

        <div className="grid xl:grid-cols-3 gap-8 mt-10">
          <div className="xl:col-span-2 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[32px] p-8">
            {renderStep()}

            <div className="flex justify-between mt-10">
              <button onClick={prevStep} disabled={step === 0} className="px-6 py-3 rounded-xl bg-white/10 disabled:opacity-30">
                Previous
              </button>

              {step < 4 ? (
                <button onClick={nextStep} className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500">
                  Next
                </button>
              ) : (
                <button onClick={submitExhibition} disabled={loading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                  {loading ? "Publishing..." : "Publish Exhibition"}
                </button>
              )}
            </div>
          </div>

          <div>
            <PreviewCard formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionManagement;