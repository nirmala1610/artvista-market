import React, {  useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
const EditArtworkModal = ({
  isOpen,
  onClose,
  artwork,
  onSave,
}) => {

const [formData, setFormData] = useState(() => ({
  title: artwork?.title || "",
  category: artwork?.category || "",
  price: artwork?.price || "",
  year: artwork?.year || "",
  medium: artwork?.medium || "",
  orientation: artwork?.orientation || "",
  style: artwork?.style || "",
  subject: artwork?.subject || "",
  material: artwork?.material || "",
  edition: artwork?.edition || "",
  imageUrl: artwork?.imageUrl || "",
  height: artwork?.height || "",
  width: artwork?.width || "",
  depth: artwork?.depth || "",
  description: artwork?.description || "" 
}));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async () => {
  await onSave(formData);
};

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <AnimatePresence>

      {isOpen && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
          fixed inset-0 z-50
          bg-black/60
          backdrop-blur-sm
          flex items-center justify-center
          p-6
          "
        >

          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            transition={{ duration: 0.25 }}
            className="
            w-full max-w-4xl
            bg-[#161A20]
            rounded-[35px]
            p-8
            shadow-2xl
            overflow-y-auto
            max-h-[90vh]
            "
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">

              <h2 className="text-4xl font-black text-white">
                Edit Artwork
              </h2>

              <button
                onClick={onClose}
                className="
                text-white
                px-4 py-2
                rounded-full
                hover:text-[#16889c]
                "
              >
                <X size={35}/>
              </button>

            </div>

            {/* IMAGE */}
            <div className="mb-8">

              <img
                src={formData.imageUrl}
                alt=""
                className="
                w-full h-[300px]
                object-cover
                rounded-3xl
                "
              />

            </div>
            

            <div className="grid grid-cols-2 gap-6">

            {/* BASIC FIELDS */}

            <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
            />

            <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
            />

            <Input
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
            />

            <Input
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
            />

            <Input
                label="Orientation"
                name="orientation"
                value={formData.orientation}
                onChange={handleChange}
            />

            <Input
                label="Edition"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
            />

            </div>
            <div className="mt-8">

                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="
                    flex items-center gap-3
                    text-white
                    font-bold
                    text-lg
                    hover:opacity-70
                    transition
                    "
                >
                    {showAdvanced ? "Hide Advanced Fields" : "Show Advanced Fields"}

                    <span
                    className={`
                    transition-transform duration-300
                    ${showAdvanced ? "rotate-180" : ""}
                    `}
                    >
                    ▼
                    </span>
                </button>
                <AnimatePresence>

                    {showAdvanced && (

                        <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="
                        overflow-hidden
                        "
                        >

                        <div className="grid grid-cols-2 gap-6 mt-6">

                            <Input
                            label="Medium"
                            name="medium"
                            value={formData.medium}
                            onChange={handleChange}
                            />

                            <Input
                            label="Style"
                            name="style"
                            value={formData.style}
                            onChange={handleChange}
                            />

                            <Input
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            />

                            <Input
                            label="Material"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            />

                        </div>
              <div className="grid grid-cols-3 gap-6 mt-6">
                <Input
                  label="Height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                />
                <Input
                  label="Width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                />
                <Input
                  label="Depth"
                  name="depth"
                  value={formData.depth}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block mb-2 font-bold text-white text-lg">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="
                    w-full
                    p-4
                    rounded-2xl
                    bg-white/70
                    outline-none
                    border border-gray-300
                    focus:border-[#002730]
                    resize-none
                  "
                />
              </div>
                </motion.div>

            )}

        </AnimatePresence>

    </div>

            {/* SAVE */}
            <button
              onClick={handleSubmit}
              className="
              mt-8
              w-full
              py-4
              rounded-2xl
              bg-[#99b1b47c]
              text-white
              text-xl
              font-bold
              hover:bg-[#619aa8]
              transition
              "
            >
              Save Changes
            </button>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
}) => (
  <div>

    <label className="block mb-2 font-bold text-white text-lg">
      {label}
    </label>

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="
      w-full
      p-4
      rounded-2xl
      bg-white/70
      outline-none
      border border-gray-300
      focus:border-[#002730]
      "
    />

  </div>
);

export default EditArtworkModal;