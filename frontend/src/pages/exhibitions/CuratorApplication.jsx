import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Upload, Briefcase, Link2, 
  FileText, CheckCircle, AlertCircle, ChevronDown, Check, ArrowDown
} from 'lucide-react';
import BackButton from '../../components/BackButton';
import { supabase } from '../../util/supabaseClient';


export default function CuratorApplication() {

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    currentRole: '',
    specializations: [],
    experience: '',
    portfolioUrl: '',
    instagram: '',
    behance: '',
    linkedin: '',
    motivation: '',
    curationStyle: '',
    skills: [],
    resume: null,
    portfolioPdf: null,
    additionalNotes: '',
    agreeAccuracy: false,
    agreeGuidelines: false,
    agreeReview: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status,setStatus] = useState();
  useEffect(()=>{
    
    const fetchUser = async()=>{
      try{
               const response = await fetch(
        "http://localhost:8080/api/auth/profile",
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`
          }
        }
      );
        const data = await response.json();
        setStatus(data.isCurater);
      }catch(err){
        console.log(err);
      }
    }

    if(token){
      fetchUser();
    }
  },[token])

  // Constants
  const specializationsList = [
    'Paintings', 'Sculpture', 'Photography', 'Digital Art', 
    'Mixed Media', 'Contemporary Art', 'Traditional Art', 'NFT / Crypto Art'
  ];

  const skillsList = [
    'Artwork Review & Approval', 'Exhibition Planning', 'Artist Collaboration', 
    'Community Moderation', 'Event Coordination', 'Visual Branding', 
    'Premium Collection Management', 'Collector Communication'
  ];

  // Validation Logic
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full name is required';
    
    
    if (!formData.phone) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      tempErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.currentRole.trim()) tempErrors.currentRole = 'Current role is required';
    if (!formData.experience) tempErrors.experience = 'Please select your experience level';
    if (formData.specializations.length === 0) tempErrors.specializations = 'Select at least one specialization';
    if (!formData.motivation.trim()) tempErrors.motivation = 'Please share your motivation';
    if (!formData.curationStyle.trim()) tempErrors.curationStyle = 'Please describe your curation style';
    if (formData.skills.length === 0) tempErrors.skills = 'Select at least one skill area';
    
    if (!formData.agreeAccuracy || !formData.agreeGuidelines || !formData.agreeReview) {
      tempErrors.agreements = 'You must accept all platform agreements to proceed';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field-specific error dynamically
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleCheckboxGroup = (category, value) => {
    setFormData(prev => {
      const currentList = prev[category];
      const updatedList = currentList.includes(value)
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      
      if (errors[category]) setErrors(err => ({ ...err, [category]: null }));
      return { ...prev, [category]: updatedList };
    });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    setIsSubmitting(true);
    try {
      let resumeUrlStr = "";
      let portfolioUrlStr = "";

      const bucketName = 'artvista-bucket-AI';

      if (formData.resume) {
        const resumeName = `resumes/${Date.now()}-${formData.resume.name}`;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(resumeName, formData.resume);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(resumeName);
        resumeUrlStr = publicUrl;
      }

      if (formData.portfolioPdf) {
        const portfolioName = `portfolios/${Date.now()}-${formData.portfolioPdf.name}`;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(portfolioName, formData.portfolioPdf);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(portfolioName);
        portfolioUrlStr = publicUrl;
      }

      const applicationPayload = {
        fullName: formData.fullName,
        phone: formData.phone,
        currentRole: formData.currentRole,
        experience: formData.experience,
        motivation: formData.motivation,
        curationStyle: formData.curationStyle,
        additionalNotes: formData.additionalNotes,
        specializations: formData.specializations, // Sends as Array
        skills: formData.skills,                     // Sends as Array
        instagram: formData.instagram,
        behance: formData.behance,
        linkedin: formData.linkedin,
        portfolioUrl: formData.portfolioUrl,
        resumeUrl: resumeUrlStr,
        portfolioPdfUrl: portfolioUrlStr
      };

      const response = await fetch('http://localhost:8080/api/curator/apply', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(applicationPayload)
      });

      if (response.ok) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error("Spring Boot server rejected payload processing request.");
      }

    } catch (error) {
      console.error("Direct storage pipeline exception:", error);
      alert("Storage Upload Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  } else {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      document.getElementsByName(firstError)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

const getActiveStepIndex = (status) => {
    switch (status) {
      case "APPLIED": return 1;
      case "UNDER_REVIEW": return 2;
      case "VERIFICATION": return 3;
      case "COMPLETED": case "APPROVED": return 4;
      default: return 0; 
    }
  };

  const activeStep = getActiveStepIndex(status);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-white">
      <div className='absolute top-0 left-0 mx-8 mt-5'>
        <BackButton/>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Context Branding & Workflow Mapping */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 h-fit">
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-2xl" />
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-900/50">
              ArtVista Creative Team
            </span>
            <h1 className="text-3xl font-bold tracking-tight mt-4 text-white">ArtVista Gallery Manager</h1>
            <p className="text-neutral-400 mt-2 text-sm leading-relaxed">
              Lead premium collections, curate exhibitions, and shape the artistic identity of the ArtVista platform.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <p className="text-xs italic text-neutral-400">
                “Curate stories. Build exhibitions. Shape the future of digital art.”
              </p>
            </div>
          </div>

          {/* Application Process Roadmap */}
<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl max-w-md mx-auto">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
          Application Workflow
        </h3>
        
        <div className="space-y-3">
          {[
            'Application Submitted', 
            'Admin Review', 
            'Portfolio Evaluation', 
            'Mock Verification Approval', 
            'Gallery Manager Access Granted'
          ].map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;

            return (
              <div key={idx} className="flex flex-col items-start">
                <div className="flex items-center gap-3">
                  
                  {/* Step Circle Pointer */}
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isActive 
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 scale-105' 
                        : isCompleted
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>

                  {/* Step Title String */}
                  <span 
                    className={`text-sm transition-colors duration-300 ${
                      isActive 
                        ? 'text-cyan-400 font-medium' 
                        : isCompleted
                        ? 'text-neutral-300'
                        : 'text-neutral-500'
                    }`}
                  >
                    {step}
                  </span>

                </div>

                {/* Connecting Line Down */}
                {idx < 4 && (
                  <ArrowDown 
                    className={`w-4 h-4 ml-3 my-1 transition-colors duration-300 ${
                      idx < activeStep ? 'text-emerald-500/40' : 'text-neutral-800'
                    }`} 
                  />
                )}
              </div>
            );
          })}
        </div>
          </div>

          {/* Benefits Block */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-4">Perks & Benefits</h3>
            <ul className="space-y-3 text-sm text-neutral-300">
              {[
                'Access to premium curator dashboard', 'Ability to feature artworks & exhibitions',
                'Collaboration with top artists & collectors', 'Early access to platform events & launches',
                'Recognition badges and curator achievements', 'Advanced analytics & engagement insights'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Dynamic Curated Form Core */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!isSubmitted && status==="NOT APPLIED"? (
              <motion.form 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onSubmit={handleSubmit}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8"
                noValidate
              >
                {/* 1. Personal Info Area */}
                <section className="space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="text-cyan-500 text-base">01.</span> Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div variants={fieldVariants} className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input 
                          type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                          placeholder="Legal or professional name"
                          className={`w-full bg-neutral-950 border ${errors.fullName ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-800 focus:ring-cyan-500/20'} focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-all`}
                        />
                      </div>
                      {errors.fullName && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.fullName}</p>}
                    </motion.div>

                    <motion.div variants={fieldVariants} className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input 
                          type="tel" name="phone" value={formData.phone} onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full bg-neutral-950 border ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-800 focus:ring-cyan-500/20'} focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-all`}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.phone}</p>}
                    </motion.div>
                  </div>

                </section>

                {/* 2. Professional Portfolio Area */}
                <section className="space-y-5">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="text-cyan-500 text-base">02.</span> Professional Profile
                    </h2>
                  </div>

                  <motion.div variants={fieldVariants} className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Current Role or Profession</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="text" name="currentRole" value={formData.currentRole} onChange={handleChange}
                        placeholder="e.g., Independent Curator, Digital Artist, Art Blogger"
                        className={`w-full bg-neutral-950 border ${errors.currentRole ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-800'} focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-all`}
                      />
                    </div>
                    {errors.currentRole && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.currentRole}</p>}
                  </motion.div>

                  <motion.div variants={fieldVariants} className="space-y-2">
                    <label className="text-xs font-medium text-neutral-300">Art Specialization <span className="text-neutral-500">(Select all that apply)</span></label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {specializationsList.map((spec) => {
                        const isSelected = formData.specializations.includes(spec);
                        return (
                          <button
                            type="button" key={spec}
                            onClick={() => handleCheckboxGroup('specializations', spec)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${isSelected ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                          >
                            <span className="truncate mr-1">{spec}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {errors.specializations && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.specializations}</p>}
                  </motion.div>

                  <motion.div variants={fieldVariants} className="space-y-2">
                    <label className="text-xs font-medium text-neutral-300">Years of Experience</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'Beginner', label: 'Beginner (0–1 Years)' },
                        { key: 'Intermediate', label: 'Intermediate (2–4 Years)' },
                        { key: 'Advanced', label: 'Advanced (5+ Years)' }
                      ].map((exp) => {
                        const isSelected = formData.experience === exp.key;
                        return (
                          <button
                            type="button" key={exp.key}
                            onClick={() => {
                              setFormData(p => ({ ...p, experience: exp.key }));
                              if (errors.experience) setErrors(e => ({ ...e, experience: null }));
                            }}
                            className={`p-3 rounded-xl border text-center text-xs transition-all font-medium ${isSelected ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/10' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                          >
                            {exp.label}
                          </button>
                        );
                      })}
                    </div>
                    {errors.experience && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.experience}</p>}
                  </motion.div>

                  <motion.div variants={fieldVariants} className="space-y-3">
                    <label className="text-xs font-medium text-neutral-300 flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-cyan-400" /> Portfolio & Social Connections
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['portfolioUrl', 'instagram', 'behance', 'linkedin'].map((linkField) => (
                        <div key={linkField} className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-600 capitalize">
                            {linkField.replace('Url', '')}:
                          </span>
                          <input 
                            type="url" name={linkField} value={formData[linkField]} onChange={handleChange}
                            placeholder="https://..."
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-500 rounded-xl pl-20 pr-4 py-2 text-xs text-white outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </section>

                {/* 3. Curator Evaluation Framework */}
                <section className="space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="text-cyan-500 text-base">03.</span> Curator Motivation
                    </h2>
                  </div>

                  <motion.div variants={fieldVariants} className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Why do you want to become a Gallery Manager at ArtVista?</label>
                    <textarea 
                      name="motivation" rows={3} value={formData.motivation} onChange={handleChange}
                      placeholder="Describe your passion for art, exhibitions, artist collaboration, or community leadership..."
                      className={`w-full bg-neutral-950 border ${errors.motivation ? 'border-red-500' : 'border-neutral-800'} focus:border-cyan-500 rounded-xl p-3 text-sm text-white placeholder-neutral-600 outline-none resize-none transition-all`}
                    />
                    {errors.motivation && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.motivation}</p>}
                  </motion.div>

                  <motion.div variants={fieldVariants} className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Describe your curation style or artistic vision</label>
                    <textarea 
                      name="curationStyle" rows={2} value={formData.curationStyle} onChange={handleChange}
                      placeholder="Example: “Minimalist digital experiences focused on futuristic storytelling.”"
                      className={`w-full bg-neutral-950 border ${errors.curationStyle ? 'border-red-500' : 'border-neutral-800'} focus:border-cyan-500 rounded-xl p-3 text-sm text-white placeholder-neutral-600 outline-none resize-none transition-all`}
                    />
                    {errors.curationStyle && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.curationStyle}</p>}
                  </motion.div>
                </section>

                {/* 4. Core Capabilities & Skill Matrix */}
                <section className="space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="text-cyan-500 text-base">04.</span> Skills & Responsibilities
                    </h2>
                  </div>

                  <motion.div variants={fieldVariants} className="space-y-2">
                    <p className="text-xs text-neutral-400">Select the functional domains where you bring specialized value:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {skillsList.map((skill) => {
                        const isChecked = formData.skills.includes(skill);
                        return (
                          <div 
                            key={skill} onClick={() => handleCheckboxGroup('skills', skill)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-3 transition-all ${isChecked ? 'bg-neutral-950 border-cyan-500/60 text-white' : 'bg-neutral-950/50 border-neutral-800/80 text-neutral-400 hover:border-neutral-800'}`}
                          >
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${isChecked ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-neutral-700'}`}>
                              {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="select-none">{skill}</span>
                          </div>
                        );
                      })}
                    </div>
                    {errors.skills && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.skills}</p>}
                  </motion.div>
                </section>

                {/* 5. Supporting Materials */}
                <section className="space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="text-cyan-500 text-base">05.</span> Supporting Documents
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Resume or CV</label>
                      <div className="relative p-4 rounded-xl bg-neutral-950 border border-neutral-800 border-dashed hover:border-neutral-700 transition-colors flex items-center gap-3">
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'resume')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <FileText className="w-5 h-5 text-neutral-500" />
                        <span className="text-xs text-neutral-400 truncate max-w-[180px]">{formData.resume ? formData.resume.name : 'Upload PDF / Word'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Exhibition Samples / Portfolio PDF</label>
                      <div className="relative p-4 rounded-xl bg-neutral-950 border border-neutral-800 border-dashed hover:border-neutral-700 transition-colors flex items-center gap-3">
                        <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'portfolioPdf')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <Upload className="w-5 h-5 text-neutral-500" />
                        <span className="text-xs text-neutral-400 truncate max-w-[180px]">{formData.portfolioPdf ? formData.portfolioPdf.name : 'Upload Archive Asset'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Additional Notes</label>
                    <textarea 
                      name="additionalNotes" rows={2} value={formData.additionalNotes} onChange={handleChange}
                      placeholder="Share anything else that may strengthen your verification profile..."
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-500 rounded-xl p-3 text-sm text-white placeholder-neutral-600 outline-none resize-none transition-all"
                    />
                  </div>
                </section>

                {/* 6. Commitments & Signature Area */}
                <section className="space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="text-cyan-500 text-base">06.</span> Platform Agreement
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: 'agreeAccuracy', label: 'I confirm that the information submitted is accurate.' },
                      { id: 'agreeGuidelines', label: 'I agree to follow ArtVista’s community guidelines and artwork quality standards.' },
                      { id: 'agreeReview', label: 'I understand that Gallery Manager approval is subject to admin review.' }
                    ].map((agree) => (
                      <label key={agree.id} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/40 border border-neutral-900 cursor-pointer select-none">
                        <input 
                          type="checkbox" name={agree.id} checked={formData[agree.id]} onChange={handleChange}
                          className="mt-0.5 rounded text-cyan-400 focus:ring-cyan-500/20 bg-neutral-950 border-neutral-800 w-4 h-4"
                        />
                        <span className="text-xs text-neutral-400 leading-normal">{agree.label}</span>
                      </label>
                    ))}
                    {errors.agreements && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.agreements}</p>}
                  </div>
                </section>

                {/* Form Processing Submitter Action */}
                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:scale-[0.99] disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-600/10 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Submit Verification Profile'}
                </button>
              </motion.form>
            ) : (
              /* Success Landing Template View */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Application Received</h2>
                  <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-cyan-400 font-semibold">{formData.fullName}</span>. Your request to join ArtVista as a Gallery Manager is currently undergoing core portfolio evaluations.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-500 max-w-sm mx-auto">
                  A confirmation has been notified to you<span className="text-neutral-300 font-medium">{formData.email}</span>.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}