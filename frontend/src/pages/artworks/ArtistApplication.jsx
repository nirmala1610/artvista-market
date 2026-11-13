import { useState,useEffect} from "react";
import { toast } from "sonner";
import { uploadToCloudinary } from "../../util/cloudinaryUpload";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";


const ArtistApplication = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [checkBox,setCheckBox] = useState(false);

  const [formData, setFormData] = useState({
  fullName: "",
  artistName: "",
  category:"",
  experience:"",
  location: "",
  portfolioUrl: "",
  portfolioSize: "",
  instagram: "",
  artStation: "",
  additionalLink: "",
  artistBio:"",
  profilePicture:null, 
  sampleArtworks:[]
  });

  const [previewProfile, setPreviewProfile] = useState(null);
  const [artworkPreviews, setArtworkPreviews] = useState([]);

  const validateLocation = async (location) => {

  try {

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
    );

    const data = await res.json();

    if (data.length === 0) {

      toast.error("Location not found");

      return false;
    }

    return true;

  } catch (err) {

    console.error(err);

    toast.error("Location validation failed");

    return false;
  }
};

const validateForm = () => {

  if (!formData.fullName.trim()) {
    toast.error("Full Name is required");
    return false;
  }

  if (formData.fullName.trim().length < 3) {
    toast.error("Full Name must be at least 3 characters");
    return false;
  }

  if (!formData.artistName.trim()) {
    toast.error("Artist Name is required");
    return false;
  }

  if (!formData.category.trim()) {
    toast.error("Please select a category");
    return false;
  }

  if (!formData.experience) {
    toast.error("Select your experience level");
    return false;
  }

  if (!formData.location.trim()) {
    toast.error("Location is required");
    return false;
  }

  if (!formData.portfolioSize) {
    toast.error("Portfolio size is required");
    return false;
  }

  if (Number(formData.portfolioSize) <= 0) {
    toast.error("Portfolio size must be greater than 0");
    return false;
  }

  if (!formData.artistBio.trim()) {
    toast.error("Artist Bio is required");
    return false;
  }

  if (formData.artistBio.trim().length < 30) {
    toast.error("Artist Bio must be at least 30 characters");
    return false;
  }

  if (formData.sampleArtworks.length === 0) {
    toast.error("Upload at least one artwork");
    return false;
  }

  if (formData.sampleArtworks.length > 5) {
    toast.error("Maximum 5 artworks allowed");
    return false;
  }

  const urlFields = [
    "portfolioUrl",
    "instagram",
    "artStation",
    "additionalLink",
  ];

  for (let field of urlFields) {

    if (formData[field]) {

      try {
        new URL(formData[field]);
      } catch {
        toast.error(`Invalid URL in ${field}`);
        return false;
      }
    }
  }
  if(!checkBox){
    toast.error("Please Confirm that you do not violate any CopyRight rules");
    return false;
  }

  return true;
};

const handleProfileUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Profile image must be less than 5MB");
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(file.type)) {
    toast.error("Only PNG and JPG allowed");
    return;
  }

  const preview = URL.createObjectURL(file);

  setPreviewProfile(preview);

  
  try {

    const imageUrl = await uploadToCloudinary(file);

    setFormData((prev) => ({
      ...prev,
      profilePicture: imageUrl,
    }));

    toast.success("Profile uploaded");

  } catch (err) {
    console.log(err);
    toast.error("Profile upload failed");
  }
};


const handleArtworkUpload = async (e) => {

  const files = Array.from(e.target.files);

  if (files.length > 5) {
    toast.error("Maximum 5 artworks only");
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  for (let file of files) {

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPG allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Each artwork must be less than 10MB");
      return;
    }
  }

  const previews = files.map((file) =>
    URL.createObjectURL(file)
  );

  setArtworkPreviews(previews);

  try {

    toast.loading("Uploading artworks...", {
      id: "artwork-upload",
    });

    const uploadedUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file))
    );

    setFormData((prev) => ({
      ...prev,
      sampleArtworks: uploadedUrls,
    }));

    toast.success("Artworks uploaded successfully", {
      id: "artwork-upload",
    });

  } catch (err) {

    console.error(err);

    toast.error("Artwork upload failed", {
      id: "artwork-upload",
    });
  }
};

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  useEffect(() => {
  return () => {
    if (previewProfile) {
      URL.revokeObjectURL(previewProfile);
    }
    if(artworkPreviews){
       artworkPreviews.forEach((url) => URL.revokeObjectURL(url));
    }
  };
}, [previewProfile,artworkPreviews]);

const handleSubmit = async (e) => {

  e.preventDefault();

  if (loading) return;

  const locationValid = await validateLocation(formData.location);

  if (!locationValid) return;

  const isValid = validateForm();

  if (!isValid) return;

  setLoading(true);

  try {

    const res = await fetch("http://localhost:8080/api/artists/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Application submitted", {
      description: "Your art journey begins now",
    });

    navigate("/")

  } catch (err) {

    console.error(err);

    toast.success("You already applied to this", {
      description: "Please wait patiently for our confirmation",
    });

  } finally {

    setLoading(false);
  }
};

  return (
    <div className="bg-[#09090B] text-white overflow-hidden relative">
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
       <div className='absolute top-0 left-0 mx-8 mt-5'>
              <BackButton/>
       </div>
        <div className="px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-md mb-6">
          <p className="text-cyan-300 tracking-[3px] uppercase text-sm font-semibold">
            ArtVista Creator Program
          </p>
        </div>

        <h1 className="text-6xl md:text-7xl font-black leading-tight max-w-5xl">
          Turn Your <span className="text-cyan-400">Creativity</span>
          <br />
          Into A Global Gallery
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mt-8 leading-relaxed">
          Join thousands of creators showcasing anime art, digital paintings,
          sketches, and cinematic masterpieces to collectors worldwide.
        </p>
      </div>

      <div className="rounded-[40px] max-w-4xl mx-auto relative mb-20">
       <div className="flex justify-center items-center">
          <form className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-10 shadow-2xl w-full" noValidate onSubmit={handleSubmit}>
            <h2 className="text-4xl font-bold mb-2">
              Artist Application
            </h2>
            <p className="text-gray-400 mb-10">
              Fill in your details and begin your creator journey.
            </p>
            <div className="space-y-7">
              <div>
                <label className="block mb-3 text-sm text-gray-300">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-3 text-sm text-gray-300">
                  Artist Name*
                </label>
                <input
                  type="text"
                  name="artistName"
                  placeholder="Your creator alias"
                   value={formData.artistName}
                  onChange={handleChange}
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
                <p className="text-gray-500 text-xs mt-1 mx-3">
                  This will be displayed on your profile and artworks.
                </p>
              </div>
            <div>
              <label className="block mb-3 text-sm text-gray-300">Primary Category*</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              >
                <option value="">Select category</option>
                <option>Digital Art</option>
                <option>Fantasy</option>
                <option>Abstract</option>
                <option>Photography</option>
                <option>Sketches</option>
                <option value="Other">Other</option>
              </select>

              {formData.category === "Other" && (
                <input
                  type="text"
                  name="category"
                  placeholder="Enter your category"
                  className="mt-4 w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
            <div>
              <label className="block mb-3 text-sm text-gray-300">Experience Level*</label>
              <div className="flex gap-5">
                {["Beginner", "Intermediate", "Professional"].map(level => (
                  <label key={level} className="flex items-center gap-2 text-gray-300">
                    <input 
                    type="radio" 
                    name="experience" 
                    value={level} 
                    required
                    checked={formData.experience === level} 
                    onChange={handleChange} 
                    className="accent-cyan-400" />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-3 text-sm text-gray-300">Location*</label>
              <input type="text"
                 name="location"
                  placeholder="City, Country"
                 value={formData.location}
                  onChange={handleChange}
                className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
            </div>
            <div>
              <label className="block mb-3 text-sm text-gray-300">Portfolio URL</label>
              <input type="url"
              name="portfolioUrl"
               placeholder="https://yourportfolio.com"
               value={formData.portfolioUrl}
               onChange={handleChange}
                className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block mb-3 text-sm text-gray-300">Portfolio Size*</label>
              <input type="number" 
               name="portfolioSize"
                placeholder="Number of artworks created"
                 value={formData.portfolioSize}
                  onChange={handleChange}
                className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
            </div>
            <div>
              <label className="block mb-3 text-sm text-gray-300">Instagram</label>
              <input type="url" placeholder="https://instagram.com/yourhandle"
              name="instagram"
               value={formData.instagram}
                  onChange={handleChange}
                className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block mb-3 text-sm text-gray-300">ArtStation</label>
              <input type="url" placeholder="https://artstation.com/yourhandle"
              name="artStation"
               value={formData.artStation}
                  onChange={handleChange}
                className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block mb-3 text-sm text-gray-300">Additional Link</label>
              <input type="url" placeholder="Behance, DeviantArt, or personal site"
              name="additionalLink"
               value={formData.additionalLink}
                  onChange={handleChange}
                className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
              <div>
                <label className="block mb-3 text-sm text-gray-300">
                  Artist Bio*
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your art style..."
                  name="artistBio"
                   value={formData.artistBio}
                  onChange={handleChange}
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl px-5 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>
                <div>
                <label className="block mb-3 text-sm text-gray-300">
                    Profile Picture
                </label>
                <label
                    htmlFor="profileUpload"
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl p-6 flex items-center gap-5 cursor-pointer hover:border-cyan-400/40 transition group"
                >
                 <input
                    id="profileUpload"
                    type="file"
                    multiple accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleProfileUpload}
                    />
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 overflow-hidden group-hover:scale-105 transition">

                    {previewProfile ? (
                        <img
                        src={previewProfile}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                        👤
                        </div>
                    )}            

                    </div>
                    <div className="flex flex-col">
                    <p className="text-white font-medium">
                        Upload Profile Picture
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        PNG or JPG • Max 5MB
                    </p>
                    </div>
                </label>
                </div>
                <div>
                <label className="block mb-3 text-sm text-gray-300">
                  Upload Sample Artworks*
                </label>

                <label
                  htmlFor="artworkUpload"
                  className="border-2 border-dashed border-white/10 rounded-3xl bg-[#0F0F12] hover:border-cyan-400/50 transition cursor-pointer flex flex-col items-center justify-center overflow-hidden relative min-h-65 group"
                >
                  <input
                    id="artworkUpload"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleArtworkUpload}
                    required
                  />

                  {artworkPreviews.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full p-5">
                      {artworkPreviews.map((preview, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden">
                          <img
                            src={preview}
                            alt={`Artwork Preview ${index + 1}`}
                            className="w-full h-40 object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <p className="text-white font-semibold">Change Artwork</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14">
                      <p className="text-6xl mb-5">🎨</p>
                      <p className="text-gray-300 font-semibold text-lg">
                        Click to upload artworks
                      </p>
                      <p className="text-gray-500 text-sm mt-2">PNG, JPG up to 10MB</p>
                      <p className="text-gray-500 text-sm mt-2">Maximum 5 artworks only</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={checkBox}
                  onChange={(e) => setCheckBox(e.target.checked)}
                  required
                  className="mt-1 accent-cyan-400"
                />
                <p className="text-sm text-gray-400 leading-relaxed">
                  I confirm that the uploaded artworks belong to me and do not
                  violate copyright rules.
                </p>
              </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-lg font-bold transition duration-300 shadow-xl
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-400 to-blue-700 hover:scale-[1.02]"
              }`}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
              <p className="text-center text-gray-500 text-sm">
                Average approval time: less than 24 hours
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistApplication;