import React, { useState } from 'react'
import { FiPlusCircle } from "react-icons/fi";
import ArtistHeader from './ArtistHeader';
import ArtistSidebar from './ArtistSidebar';
import {toast} from 'sonner'
import { uploadToCloudinary } from "../../util/cloudinaryUpload";
const UploadArtwork = () => {

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        price: "",
        edition: "",
        medium: "",
        imageUrl:"",
        orientation: "Portrait",
        style: "",
        subject: "",
        material: "",
        height: "",
        width: "",
        depth: "",
        year: "",
        description: ""
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("image must be less than 5MB");
            return;
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PNG and JPG allowed");
            return;
        }

        const preview = URL.createObjectURL(file);

        setImage(preview);

        try {

            const url = await uploadToCloudinary(file);

            setFormData((prev) => ({
            ...prev,
            imageUrl: url,
            }));

            toast.success("Artwork uploaded");

        } catch (err) {
            console.log(err);
            toast.error("Artwork upload failed");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {

        if (!image) {
            toast.error("Please upload artwork image 🎨");
            return false;
        }

        if (!formData.title.trim()) {
            toast.error("Title is required");
            return false;
        }

        if (!formData.category.trim()) {
            toast.error("Category is required");
            return false;
        }

        if (!formData.price || formData.price <= 0) {
            toast.error("Enter valid price");
            return false;
        }

        if (!formData.edition || formData.edition <= 0) {
            toast.error("Edition must be greater than 0");
            return false;
        }

        if (!formData.medium.trim()) {
            toast.error("Medium is required");
            return false;
        }

        if (!formData.height || formData.height <= 0) {
            toast.error("Enter valid height");
            return false;
        }

        if (!formData.width || formData.width <= 0) {
            toast.error("Enter valid width");
            return false;
        }

        if (!formData.year.trim()) {
            toast.error("Year is required");
            return false;
        }

        if (!formData.description.trim()) {
            toast.error("Description is required");
            return false;
        }

        if (!formData.imageUrl) {
            toast.error("Please wait for image upload");
            return false;
        }

        return true;
    };

const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

        setLoading(true);

        const payload = {
            ...formData,
            price: Number(formData.price),
            edition: Number(formData.edition),
            height: Number(formData.height),
            width: Number(formData.width),
            depth: Number(formData.depth),
        };

        const response = await fetch(
            "http://localhost:8080/api/artworks/upload",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`,  
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const result = await response.json();
        if (image) {
            URL.revokeObjectURL(image);
        }
        setImage(null);

        toast.success("Artwork uploaded successfully");

        console.log(result);

        setFormData({
            title: "",
            category: "",
            price: "",
            edition: "",
            medium: "",
            imageUrl: "",
            orientation: "Portrait",
            style: "",
            subject: "",
            material: "",
            height: "",
            width: "",
            depth: "",
            year: "",
            description: ""
        });

        setImage(null);

    } catch (error) {

        console.error(error);

        toast.error("Something went wrong 💀");

    } finally {

        setLoading(false);
    }
};

    return (
        <div>

            <ArtistHeader />

            <div className="flex">

                <ArtistSidebar />

                <div className="flex mr-10 my-25 mx-15 text-2xl bg-[#B5C4D2] rounded-3xl w-full h-auto my-20">

                    {image ? (
                        <div className="w-2xs h-auto mx-10 my-10 border-5 border-dashed border-gray-500 p-4 flex flex-col justify-center items-center cursor-pointer">
                            <label className="cursor-pointer">
                                <img src={image} alt="preview" className="w-full h-auto" />
                                <h1 className="text-gray-700 font-bold font-['Inria_Sans'] mx-5">
                                    Change Artwork
                                </h1>
                                <input
                                    type='file'
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="w-2xs h-auto mx-10 my-10 border-5 border-dashed border-gray-500 p-4 flex flex-col justify-center items-center cursor-pointer">
                            <label className="cursor-pointer">
                                <FiPlusCircle className="w-10 h-10 text-gray-500 mx-20" />
                                <h1 className="text-gray-700 font-bold font-['Inria_Sans'] mx-15">
                                    Upload Artwork
                                </h1>
                                <input
                                    type='file'
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    )}

                    <div className="flex flex-col mx-10 my-7 font-['Inia_Sans'] text-gray-700 w-full">

                        <form onSubmit={handleSubmit}>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Title*
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter artwork title"
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Category*
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    placeholder="e.g. Painting, Sculpture"
                                    name='category'
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    name='price'
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Edition */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Edition*
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    placeholder="Limited edition number"
                                    name='edition'
                                    value={formData.edition}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Medium */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Medium
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    placeholder="e.g. Oil on canvas"
                                    name='medium'
                                    value={formData.medium}
                                    onChange={handleChange}
    
                                />
                            </div>

                            {/* Orientation */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Orientation
                                </label>
                                <select className="mt-1 block w-full border rounded-md p-2"
                                name='orientation'
                                 value={formData.orientation}
                                onChange={handleChange}>
                                    <option>Portrait</option>
                                    <option>Landscape</option>
                                    <option>Square</option>
                                </select>
                            </div>

                            {/* Style */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Style
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    placeholder="e.g. Abstract, Modern"
                                    name='style'
                                    value={formData.style}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    placeholder="e.g. Nature, Portrait"
                                    name='subject'
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Material */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Material
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    placeholder="e.g. Canvas, Wood"
                                    name='material'
                                    value={formData.material}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Dimensions */}
                            <div className="grid grid-cols-3 gap-4">

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 my-3">
                                        Height (cm)*
                                    </label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full border rounded-md p-2"
                                        name='height'
                                        value={formData.height}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 my-3">
                                        Width (cm)*
                                    </label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full border rounded-md p-2"
                                        name='width'
                                        value={formData.width}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 my-3">
                                        Depth (cm)
                                    </label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full border rounded-md p-2"
                                        name='depth'
                                        value={formData.depth}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Year Created*
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    placeholder="e.g. 2026"
                                    name='year'
                                    value={formData.year}
                                    onChange={handleChange}
                                />
                            </div>


                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 my-3">
                                    Description*
                                </label>
                                <textarea
                                    className="mt-1 block w-full border rounded-md p-2"
                                    rows="4"
                                    placeholder="Describe your artwork"
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full my-5 px-2 py-4 text-white bg-slate-800 text-4xl font-['Poller_One'] rounded-4xl hover:scale-105 transition-transform duration-300 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? "Uploading..." : "Submit Artwork"}
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default UploadArtwork