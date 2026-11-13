import React from "react";

const BasicInfoStep = ({ formData, setFormData, errors }) => {
  const SAMPLE_GALLERIES = [
    { id: "gal-01", name: "The Chelsea Cube", address: "520 W 24th St", city: "New York", zip: "10011", isCurrentlyBooked: false },
    { id: "gal-02", name: "Gagosian Parallel", address: "980 Madison Ave", city: "New York", zip: "10021", isCurrentlyBooked: false },
    { id: "gal-03", name: "The Warehouse District Venue", address: "1700 S Santa Fe Ave", city: "Los Angeles", zip: "90021", isCurrentlyBooked: false },
    { id: "gal-04", name: "Prism Contemporary", address: "224 Sandro St", city: "Miami", zip: "33145", isCurrentlyBooked: false },
    { id: "gal-05", name: "Foundry & Co Space", address: "844 W Washington Blvd", city: "Chicago", zip: "60607", isCurrentlyBooked: false },
    { id: "gal-06", name: "Apex Digital Vault", address: "Metropolitan Towers Suite 4B", city: "San Francisco", zip: "94103", isCurrentlyBooked: false },
    { id: "gal-07", name: "Somerset Fine Arts", address: "Cork Street Gallery 12", city: "London", zip: "W1S 3NY", isCurrentlyBooked: false },
    { id: "gal-08", name: "Neon Horizon Studio", address: "3-10-25 Shibuya", city: "Tokyo", zip: "150-0002", isCurrentlyBooked: false },
    { id: "gal-09", name: "The Canvas Compound", address: "46 Rue de Sévigné", city: "Paris", zip: "75003", isCurrentlyBooked: false },
    { id: "gal-10", name: "Elysium Atelier", address: "Leipziger Str. 54", city: "Berlin", zip: "10117", isCurrentlyBooked: false }
  ];
  
  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    const gallery = SAMPLE_GALLERIES.find(g => g.id === selectedId);
    
    if (gallery) {
      setFormData({
        ...formData,
        locationId: gallery.id,
        location: `${gallery.name}, ${gallery.address}, ${gallery.city}`
      });
    } else {
      setFormData({ ...formData, locationId: "", location: "" });
    }
  };

  return (
    <div className="space-y-6">
      {/* EXHIBITION TITLE */}
      <div>
        <input
          name="title"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Exhibition Title"
          className="w-full p-4 rounded-2xl bg-[#0D1117] text-white border border-white/5 focus:border-cyan-500 outline-none transition"
        />
        {errors.title && <p className="text-red-400 text-sm mt-1 ml-2">{errors.title}</p>}
      </div>

      {/* THEME */}
      <input
        name="themeName"
        value={formData.themeName || ""}
        onChange={(e) => setFormData({ ...formData, themeName: e.target.value })}
        placeholder="Theme"
        className="w-full p-4 rounded-2xl bg-[#0D1117] text-white border border-white/5 focus:border-cyan-500 outline-none transition"
      />

      {/* CHOOSE PRESET GALLERY LOCATION */}
      <div>
        <select
          name="locationSelector"
          value={formData.locationId || ""}
          onChange={handleLocationChange}
          className="w-full p-4 rounded-2xl bg-[#0D1117] text-white border border-white/5 focus:border-cyan-500 outline-none transition cursor-pointer"
        >
          <option value="">-- Select an Exhibition Location --</option>
          {SAMPLE_GALLERIES.map((gal) => (
            <option 
              key={gal.id} 
              value={gal.id} 
              disabled={gal.isCurrentlyBooked}
              className={gal.isCurrentlyBooked ? "text-gray-600 bg-black/40" : "text-white"}
            >
              {gal.name} ({gal.city}) {gal.isCurrentlyBooked ? "[⚠️ Booked]" : "[Available]"}
            </option>
          ))}
        </select>
        {errors.location && <p className="text-red-400 text-sm mt-1 ml-2">{errors.location}</p>}
      </div>

      {/* CATEGORY */}

      <select
        name="category"
        value={formData.category || "Digital Art"}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full p-4 rounded-2xl bg-[#0D1117] text-white border border-white/5 focus:outline-none focus:border-cyan-500/50 transition-colors [color-scheme:dark]"
      >
        <optgroup label="Digital & New Media" className="text-cyan-400 bg-[#0D1117]">
          <option value="Digital Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">Digital Art</option>
          <option value="NFT" className="bg-[#0D1117] text-white checked:bg-cyan-600">NFT / Crypto Art</option>
          <option value="3D Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">3D Art & Modeling</option>
          <option value="AI Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">AI Generated Art</option>
          <option value="Pixel Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">Pixel Art</option>
          <option value="Vector Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">Vector Art</option>
          <option value="Concept Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">Concept Art / Illustration</option>
          <option value="Animation" className="bg-[#0D1117] text-white checked:bg-cyan-600">Animation / Motion Graphics</option>
        </optgroup>

        <optgroup label="Traditional Fine Art" className="text-cyan-400 bg-[#0D1117]">
          <option value="Painting" className="bg-[#0D1117] text-white checked:bg-cyan-600">Painting (Oil/Acrylic/Watercolor)</option>
          <option value="Drawing" className="bg-[#0D1117] text-white checked:bg-cyan-600">Drawing & Sketching (Charcoal/Ink)</option>
          <option value="Sculpture" className="bg-[#0D1117] text-white checked:bg-cyan-600">Sculpture</option>
          <option value="Printmaking" className="bg-[#0D1117] text-white checked:bg-cyan-600">Printmaking (Linocut/Etching)</option>
          <option value="Calligraphy" className="bg-[#0D1117] text-white checked:bg-cyan-600">Calligraphy & Lettering</option>
          <option value="Ceramics" className="bg-[#0D1117] text-white checked:bg-cyan-600">Ceramics & Pottery</option>
        </optgroup>

        <optgroup label="Photography & Film" className="text-cyan-400 bg-[#0D1117]">
          <option value="Fine Art Photography" className="bg-[#0D1117] text-white checked:bg-cyan-600">Fine Art Photography</option>
          <option value="Landscape Photography" className="bg-[#0D1117] text-white checked:bg-cyan-600">Landscape Photography</option>
          <option value="Portrait Photography" className="bg-[#0D1117] text-white checked:bg-cyan-600">Portrait Photography</option>
          <option value="Street Photography" className="bg-[#0D1117] text-white checked:bg-cyan-600">Street Photography</option>
          <option value="Cinematography" className="bg-[#0D1117] text-white checked:bg-cyan-600">Cinematography / Short Film</option>
        </optgroup>

        <optgroup label="Design & Mixed Media" className="text-cyan-400 bg-[#0D1117]">
          <option value="Graphic Design" className="bg-[#0D1117] text-white checked:bg-cyan-600">Graphic Design</option>
          <option value="Mixed Media" className="bg-[#0D1117] text-white checked:bg-cyan-600">Mixed Media / Collage</option>
          <option value="Textile Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">Textile & Fiber Art</option>
          <option value="Street Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">Street Art / Graffiti</option>
          <option value="Installation Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">Installation Art</option>
          <option value="Generative Art" className="bg-[#0D1117] text-white checked:bg-cyan-600">Generative Art / Code Art</option>
        </optgroup>
      </select>
      {/* DESCRIPTION */}
      <textarea
        name="description"
        value={formData.description || ""}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description..."
        className="w-full p-4 rounded-2xl bg-[#0D1117] text-white border border-white/5 focus:border-cyan-500 outline-none transition"
        rows={4}
      />
    </div>
  );
};

export default BasicInfoStep;