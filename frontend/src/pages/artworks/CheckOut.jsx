import { FaArrowUp, FaArrowDown, FaPlus, FaStar, FaSmile, FaLock, FaCcMastercard, FaCreditCard } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { MdAttachMoney, MdSecurity } from "react-icons/md";
import { BsFillShieldLockFill } from "react-icons/bs";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import { toast } from "sonner";
import { FaCcVisa } from "react-icons/fa6";
import { X, ShieldCheck } from "lucide-react";
import QRCode from "react-qr-code";
import BackButton from "../../components/BackButton";

/* ── Injected global styles ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Jockey+One&family=Inria+Sans:wght@400;700&family=Lisu+Bosa:wght@400;600;700&family=DM+Mono:wght@300;400&display=swap');

  /* Collapse/expand animation */
  .section-body {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0.4,0,0.2,1),
                opacity 0.35s ease,
                transform 0.35s ease;
  }
  .section-body.open  { max-height: 2000px; opacity: 1; transform: translateY(0); }
  .section-body.closed{ max-height: 0;      opacity: 0; transform: translateY(-8px); }

  /* Fade-up on mount */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation: fadeUp 0.5s 0.08s ease both; }
  .fade-up-2 { animation: fadeUp 0.5s 0.16s ease both; }
  .fade-up-3 { animation: fadeUp 0.5s 0.24s ease both; }
  .fade-up-4 { animation: fadeUp 0.5s 0.32s ease both; }

  /* Gold shimmer on price */
  @keyframes goldShimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .price-gold {
    background: linear-gradient(90deg, #4cc9c3 30%, #8aedf0 50%, #4cbac9 70%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: goldShimmer 3.5s linear infinite;
  }

  /* Arrow rotate */
  .arrow-icon {
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s;
  }
  .arrow-icon:hover { opacity: 0.7; transform: scale(1.15); }

  /* Input focus */
  .co-input {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #d9e8e7;
    padding: 13px 16px;
    width: 100%;
    font-family: 'Inria Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }
  .co-input::placeholder { color: rgba(255,255,255,0.3); }
  .co-input:focus {
    border-color: rgba(76, 182, 201, 0.6);
    background: rgba(255,255,255,0.09);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
  }
  .co-input option { background: #1a1a1a; color: #d9e4e8; }

  /* Section card */
  .co-card {
    background: #1A1C1C;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    transition: border-color 0.3s;
  }
  .co-card:hover { border-color: rgba(201,168,76,0.15); }

  /* Section header */
  .co-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px 40px;
    cursor: pointer;
    user-select: none;
  }
  .co-section-title {
    font-family: 'Jockey One', sans-serif;
    font-size: 1.6rem;
    color: #d9e3e8;
    margin: 0;
    letter-spacing: 0.02em;
  }

  /* Payment method radio row */
  .pay-method-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 0;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .pay-method-row:hover { opacity: 0.8; }

  /* Radio circle */
  .radio-dot {
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 2px solid rgba(154, 176, 197, 0.3);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s;
    flex-shrink: 0;
  }
  .radio-dot.active {
    border-color: #69d0dd;
  }
  .radio-dot.active::after {
    content:'';
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #2e9a9e;
  }

  /* Payment logos */
  .pay-logo {
    opacity: 0.85;
    transition: opacity 0.2s, transform 0.2s;
    cursor: pointer;
  }
  .pay-logo:hover { opacity: 1; transform: scale(1.08); }

  /* Summary card */
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 40px;
    font-family: 'Lisu Bosa', sans-serif;
    font-size: 1.15rem;
    color: #e8e2d9;
  }
  .summary-divider {
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 0 40px;
  }
  .summary-total { font-size: 1.4rem; font-weight: 700; }

  /* Trust strip */
  .trust-strip {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    background: #1A1C1C;
    overflow: hidden;
  }
  .trust-item {
    padding: 36px 28px;
    border-right: 1px solid rgba(255,255,255,0.07);
    display: flex; flex-direction: column; gap: 10px;
    transition: background 0.2s;
  }
  .trust-item:last-child { border-right: none; }
  .trust-item:hover { background: rgba(255,255,255,0.03); }
  .trust-icon { color: #4cc9c9; font-size: 1.5rem; }
  .trust-title {
    font-family: 'Lisu Bosa', sans-serif;
    font-size: 0.95rem; font-weight: 700;
    color: #e8e2d9;
    line-height: 1.3;
  }
  .trust-desc {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.07em;
    color: rgba(255,255,255,0.4);
    line-height: 1.6;
  }

  /* Help bar */
  .help-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 36px 40px;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    background: #1A1C1C;
  }
  .help-bar-title {
    font-family: 'Inria Sans', sans-serif;
    font-size: 1.8rem; font-weight: 700;
    color: #e8e2d9;
  }
  .help-btn {
    padding: 13px 32px;
    border-radius: 100px;
    font-family: 'Inria Sans', sans-serif;
    font-size: 1rem; font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
  }
  .help-btn-outline {
    background: none;
    border: 1px solid rgba(255,255,255,0.2);
    color: #e8e2d9;
  }
  .help-btn-outline:hover { border-color: #4cc5c9; color: #4cc9c9; }
  .help-btn-fill {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: #e8e2d9;
  }
  .help-btn-fill:hover { background: #4cbac9; color: #0d0d0d; border-color: #4cc1c9; }

  /* Save address button */
  .save-addr-btn {
    background: #61ACBD;
    color: #0d0d0d;
    font-family: 'Jockey One', sans-serif;
    font-size: 1.05rem;
    padding: 14px 48px;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    transition: background 0.25s, transform 0.2s, box-shadow 0.2s;
  }
  .save-addr-btn:hover {
    background: #70d9fc;
    transform: scale(1.03);
    box-shadow: 0 8px 24px rgba(97,172,189,0.3);
  }
  .save-addr-btn:active { transform: scale(0.98); }

  /* Checkbox */
  .co-checkbox { accent-color: #4cc9c3; cursor: pointer; width: 18px; height: 18px; }

  /* Modal backdrop */
  .modal-backdrop {
    animation: fadeIn 0.25s ease both;
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  .modal-card {
    animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(0.92); }
    to   { opacity:1; transform:scale(1); }
  }

  /* Step indicator */
  .step-dots {
    display: flex; gap: 8px; align-items: center;
  }
  .step-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    transition: background 0.3s, width 0.3s;
  }
  .step-dot.active {
    background: #4cbac9;
    width: 24px; border-radius: 4px;
  }
`;

const CheckOut = () => {
  const [cart, setCart] = useState(true);
  const [address, setAddress] = useState(false);
  const [payment, setPayment] = useState(false);
  const navigate = useNavigate();
  const [card, setCard] = useState(true);
  const [cardOpen, setCardOpen] = useState(false);
  const [upi, setUpi] = useState(false);
  const [upiOpen, setUpiOpen] = useState(false);
  const [art, setArt] = useState(null);

  const [loading,setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const artworkId = searchParams.get("artworkId");
  const quantity = Number(searchParams.get("quantity")) || 1;
  const countries = countryList().getData();
  const [addressId, setAddressId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", addressLine1: "", addressLine2: "",
    city: "", state: "", country: "", zipcode: "",
    phoneNumber: "", email: "", isDefault: false,
  });

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchSavedAddress = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/address/default", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch address");
        const data = await response.json();
        setAddressId(data.id);
        setFormData({
          firstName: data.firstName || "", lastName: data.lastName || "",
          addressLine1: data.addressLine1 || "", addressLine2: data.addressLine2 || "",
          city: data.city || "", state: data.state || "", country: data.country || "",
          zipcode: data.zipcode || "", phoneNumber: data.phoneNumber || "",
          email: data.email || "", isDefault: data.isDefault || false,
        });
      } catch (error) { console.log("No saved address found", error); }
    };
    fetchSavedAddress();
  }, []);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/artworks/artDetail?artworkId=${encodeURIComponent(artworkId)}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setArt(data);
      } catch (err) { console.error(err); }
    };
    fetchArt();
  }, [artworkId]);

  const handleNewAddress = () => {
    setAddressId(null);
    setFormData({ firstName:"",lastName:"",addressLine1:"",addressLine2:"",city:"",state:"",country:"",zipcode:"",phoneNumber:"",email:"",isDefault:false });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{5,10}$/.test(formData.zipcode)) { toast.error("Invalid Zip/Postal Code", { description: "Must be 5–10 digits." }); return; }
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) { toast.error("Invalid Phone Number", { description: "10-digit number required." }); return; }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) { toast.error("Invalid Email Address"); return; }
    try {
      const checkRes = await fetch("http://localhost:8080/api/address/default", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      let res;
      if (addressId == null && checkRes.ok) {
        const existingAddress = await checkRes.json();
        res = await fetch(`http://localhost:8080/api/address/update/${existingAddress.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("http://localhost:8080/api/address/add", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify(formData),
        });
      }
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        toast.success("Address saved!", { description: "Your shipping address is ready." });
        setAddress(false);
        setPayment(true);
      } else { toast.error("Failed to save address"); }
    } catch (err) { console.error(err); toast.error("Something went wrong"); }
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleOrder = async () => {
    try {
      if (cardOpen) {
        if (!/^\d{16}$/.test(cardNumber)) { toast.warning("Invalid Card Number", { description: "16 digits required." }); return; }
        if (!/^[A-Za-z ]+$/.test(cardHolder)) { toast.warning("Invalid Card Holder Name"); return; }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) { toast.warning("Invalid Expiry Date", { description: "MM/YY format." }); return; }
        if (!/^\d{3,4}$/.test(cvv)) { toast.warning("Invalid CVV"); return; }
        const [month, year] = expiry.split("/");
        if (new Date(`20${year}`, month) < new Date()) { toast.warning("Card expired"); return; }
      }
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/orders/checkout?totalAmount=${quantity * (art?.price || 0)}&artworkId=${artworkId}`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!res.ok) { 
        toast.error("Payment failed");
        setLoading(false);
        return; }
      setCardOpen(false); setUpiOpen(false);
      toast.success("Payment successful!");
      navigate("/");
      setLoading(false);
    } catch (err) { 
      console.error(err); 
      toast.error("Something went wrong"); 
      setLoading(false)
    }
  };

  // Step indicator: 0=cart, 1=address, 2=payment
  const step = payment ? 2 : address ? 1 : 0;

  const trustItems = [
    { icon: <MdSecurity />, title: "No Surprise Fees", desc: "Total price is final — taxes, duties & fees included." },
    { icon: <FaStar />, title: "Five-Star Reviews", desc: "World-class customer service, every order." },
    { icon: <FaSmile />, title: "Free 14-day Returns", desc: "Shop with complete confidence." },
    { icon: <FaLock />, title: "Safe & Secure", desc: "All transactions encrypted." },
    { icon: <MdAttachMoney />, title: "Support An Artist", desc: "Artists earn more on every sale." },
  ];

  if (loading) {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-cyan-400"></div>
    </div>
  );
}

  return (
    <>
      <style>{styles}</style>

      <div style={{ background: "#0d0d0d", minHeight: "100vh", paddingBottom: "100px" }}>
          <div className="mx-10 mt-6">
            
          </div>
        {/* ── Page header ── */}
        <div className="fade-up" style={{ padding: "48px 64px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
           <div className="flex flex-col gap-6">
            <BackButton/>
            <h1 style={{ fontFamily: "'Jockey One', sans-serif", fontSize: "2.2rem", color: "#e8e2d9", margin: 0, letterSpacing: "0.04em" }}>
              Checkout
            </h1>
           </div>
            {/* Step dots */}
            <div className="step-dots">
              {["Cart", "Address", "Payment"].map((label, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className={`step-dot ${step >= i ? "active" : ""}`} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: step >= i ? "#4cc1c9" : "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
                    {label}
                  </span>
                  {i < 2 && <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />}
                </div>
              ))}
            </div>
          </div>
          {/* Gold underline */}
          <div style={{ height: 1, background: "linear-gradient(90deg,#4cb0c9,transparent)", marginTop: 20 }} />
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 64px 0" }}>

          {/* ═══ CART SECTION ═══ */}
          <div className="co-card fade-up-1" style={{ marginBottom: 20 }}>
            <div className="co-section-header" onClick={() => { setCart(!cart); if (!cart) { setAddress(false); setPayment(false); } }}>
              <h2 className="co-section-title">In your Cart</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {!cart && art && (
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.72rem", color: "#4cc1c9", letterSpacing: "0.15em" }}>
                    {art.title?.slice(0, 28)}{art.title?.length > 28 ? "…" : ""}
                  </span>
                )}
                {cart
                  ? <FaArrowUp className="arrow-icon" style={{ color: "#e8e2d9", width: 20, height: 20 }} />
                  : <FaArrowDown className="arrow-icon" style={{ color: "#e8e2d9", width: 20, height: 20 }} />
                }
              </div>
            </div>

            <div className={`section-body ${cart ? "open" : "closed"}`}>
              <div style={{ padding: "0 40px 36px", display: "flex", gap: 40 }}>
                <img
                  src={art?.imageUrl || "/Arts/Art2.jpg"}
                  alt="artwork"
                  style={{ width: 320, height: 210, objectFit: "cover", borderRadius: 12, flexShrink: 0, transition: "transform 0.4s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h2 style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "1.5rem", color: "#e8e2d9", margin: 0, lineHeight: 1.3 }}>
                    {art?.title || "Artwork Title"}
                  </h2>
                  <div style={{ fontFamily: "'Inria Sans',sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                    Category: {art?.category}<br />
                    Orientation: {art?.orientation}<br />
                    Edition: {art?.edition}<br />
                    Year: {art?.year}
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontFamily: "'Inria Sans',sans-serif", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
                      {quantity} {quantity === 1 ? "product" : "products"}
                    </span>
                    <span className="price-gold" style={{ fontFamily: "'Inria Sans',sans-serif", fontSize: "2rem", fontWeight: 700 }}>
                      ₹{(quantity * (art?.price || 0)).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => navigate("/buyer/artDetail", { state: { data: artworkId } })}
                      style={{ background: "none", border: "none", color: "#61ACBD", fontFamily: "'Inria Sans',sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", textAlign: "left", padding: 0, textDecoration: "underline", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#70d9fc"}
                      onMouseLeave={e => e.currentTarget.style.color = "#61ACBD"}
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
              {/* Proceed nudge */}
              <div style={{ padding: "0 40px 28px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => { setCart(false); setAddress(true); setPayment(false); }}
                  style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.35)", color: "#4cc9c9", fontFamily: "'DM Mono',monospace", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "11px 28px", borderRadius: 8, cursor: "pointer", transition: "background 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.2)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(201,168,76,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  Continue to Address →
                </button>
              </div>
            </div>
          </div>

          {/* ═══ ADDRESS SECTION ═══ */}
          <div className="co-card fade-up-2" style={{ marginBottom: 20 }}>
            <div
              className="co-section-header"
              onClick={() => { if (!address) { setCart(false); setAddress(true); setPayment(false); } else { setAddress(false); } }}
            >
              <h2 className="co-section-title">Shipping Address</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {!address && formData.addressLine1 && (
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.72rem", color: "#4cb0c9", letterSpacing: "0.12em" }}>
                    {formData.city}{formData.city && formData.state ? ", " : ""}{formData.state}
                  </span>
                )}
                {address
                  ? <FaArrowUp className="arrow-icon" style={{ color: "#e8e2d9", width: 20, height: 20 }} />
                  : <FaArrowDown className="arrow-icon" style={{ color: "#e8e2d9", width: 20, height: 20 }} />
                }
              </div>
            </div>

            <div className={`section-body ${address ? "open" : "closed"}`}>
              <form onSubmit={handleAddressSubmit} style={{ padding: "0 40px 36px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <input className="co-input" type="text" placeholder="First Name *" value={formData.firstName} onChange={handleInputChange} name="firstName" required />
                  <input className="co-input" type="text" placeholder="Last Name *" value={formData.lastName} onChange={handleInputChange} name="lastName" required />
                </div>
                <input className="co-input" type="text" placeholder="Address Line 1 *" value={formData.addressLine1} onChange={handleInputChange} name="addressLine1" required />
                <input className="co-input" type="text" placeholder="Address Line 2" value={formData.addressLine2} onChange={handleInputChange} name="addressLine2" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <input className="co-input" type="text" placeholder="City *" value={formData.city} onChange={handleInputChange} name="city" required />
                  <input className="co-input" type="text" placeholder="State / Region *" value={formData.state} onChange={handleInputChange} name="state" required />
                </div>
                <select className="co-input" value={formData.country} onChange={handleInputChange} name="country" required>
                  <option value="">Select Country *</option>
                  {countries.map((c) => <option key={c.value} value={c.label}>{c.label}</option>)}
                </select>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <input className="co-input" type="text" placeholder="Zip / Postal Code *" value={formData.zipcode} onChange={handleInputChange} name="zipcode" required />
                  <input className="co-input" type="text" placeholder="Phone Number *" value={formData.phoneNumber} onChange={handleInputChange} name="phoneNumber" required />
                </div>
                <input className="co-input" type="email" placeholder="Email *" value={formData.email} onChange={handleInputChange} name="email" required />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: "#e8e2d9", fontFamily: "'Inria Sans',sans-serif", fontSize: "1rem" }}>
                    <input type="checkbox" className="co-checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} />
                    Set as default shipping address
                  </label>
                  <button type="button" onClick={handleNewAddress}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#4cb6c9", fontFamily: "'Inria Sans',sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <FaPlus style={{ fontSize: "0.85rem" }} /> Add New Address
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                  <button type="submit" className="save-addr-btn">Save Shipping Address</button>
                </div>
              </form>
            </div>
          </div>

          {/* ═══ PAYMENT SECTION ═══ */}
          <div className="co-card fade-up-3" style={{ marginBottom: 20 }}>
            <div
              className="co-section-header"
              onClick={() => { if (!payment) { setCart(false); setAddress(false); setPayment(true); } else { setPayment(false); } }}
            >
              <h2 className="co-section-title">Payment Method</h2>
              {payment
                ? <FaArrowUp className="arrow-icon" style={{ color: "#e8e2d9", width: 20, height: 20 }} />
                : <FaArrowDown className="arrow-icon" style={{ color: "#e8e2d9", width: 20, height: 20 }} />
              }
            </div>

            <div className={`section-body ${payment ? "open" : "closed"}`}>
              <div style={{ padding: "0 40px 36px", display: "flex", flexDirection: "column", gap: 0 }}>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

                {/* Card option */}
                <div>
                  <div className="pay-method-row" onClick={() => { setCard(true); setUpi(false); }}>
                    <div className={`radio-dot ${card ? "active" : ""}`} />
                    <h3 style={{ fontFamily: "'Lisu Bosa',sans-serif", fontSize: "1.15rem", color: "#e8e2d9", margin: 0 }}>
                      Debit Card or Credit Card
                    </h3>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                      <BsFillShieldLockFill style={{ color: "#4c9bc9", fontSize: "1rem" }} />
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}>SECURE</span>
                    </div>
                  </div>

                  <div className={`section-body ${card ? "open" : "closed"}`} style={{ paddingLeft: 34 }}>
                    <div style={{ display: "flex", gap: 20, padding: "12px 0 20px", flexWrap: "wrap", alignItems: "center" }}>
                      <img src="https://img.icons8.com/?size=100&id=13608&format=png&color=000000" alt="visa" className="pay-logo" style={{ height: 44, background: "#fff", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }} onClick={() => setCardOpen(true)} />
                      <img src="/Icons/mastercard.png" alt="mastercard" className="pay-logo" style={{ height: 44, cursor: "pointer" }} onClick={() => setCardOpen(true)} />
                      <button onClick={() => setCardOpen(true)}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 16px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono',monospace", fontSize: "0.72rem", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.1em" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#4cb6c9"; e.currentTarget.style.color = "#4cc1c9"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                      >
                        <FaPlus style={{ fontSize: "0.7rem" }} /> ADD NEW CARD
                      </button>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />

                {/* UPI option */}
                <div>
                  <div className="pay-method-row" onClick={() => { setCard(false); setUpi(true); }}>
                    <div className={`radio-dot ${upi ? "active" : ""}`} />
                    <h3 style={{ fontFamily: "'Lisu Bosa',sans-serif", fontSize: "1.15rem", color: "#e8e2d9", margin: 0 }}>
                      Scan and Pay with UPI
                    </h3>
                    <img src="/Icons/upi.png" alt="upi" style={{ height: 28, marginLeft: 12, opacity: 0.8 }} />
                  </div>

                  <div className={`section-body ${upi ? "open" : "closed"}`} style={{ paddingLeft: 34 }}>
                    <div style={{ display: "flex", gap: 28, padding: "12px 0 20px", alignItems: "center", flexWrap: "wrap" }}>
                      {[
                        { src: "/Icons/gpay.png", alt: "gpay", h: 36 },
                        { src: "/Icons/phonePe.png", alt: "phonepe", h: 40 },
                        { src: "/Icons/paytm.png", alt: "paytm", h: 40 },
                        { src: "/Icons/bhim.png", alt: "bhim", h: 32 },
                      ].map(({ src, alt, h }) => (
                        <img key={alt} src={src} alt={alt} className="pay-logo" style={{ height: h, cursor: "pointer" }} onClick={() => setUpiOpen(true)} />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ═══ ORDER SUMMARY ═══ */}
          <div className="co-card fade-up-4" style={{ marginBottom: 40 }}>
            <div style={{ padding: "28px 40px 4px" }}>
              <h2 className="co-section-title">Order Summary</h2>
            </div>
            <div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{(quantity * (art?.price || 0)).toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>₹111</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total" style={{ paddingBottom: 32 }}>
                <span>Total</span>
                <span className="price-gold">₹{(quantity * (art?.price || 0) + 111).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* ═══ TRUST STRIP ═══ */}
          <div className="trust-strip" style={{ marginBottom: 24 }}>
            {trustItems.map((t, i) => (
              <div className="trust-item" key={i}>
                <div className="trust-icon">{t.icon}</div>
                <div className="trust-title">{t.title}</div>
                <div className="trust-desc">{t.desc}</div>
              </div>
            ))}
          </div>

          {/* ═══ HELP BAR ═══ */}
          <div className="help-bar">
            <span className="help-bar-title">Need More Help?</span>
            <div style={{ display: "flex", gap: 14 }}>
              <button className="help-btn help-btn-outline">Contact Art Advisory</button>
              <button className="help-btn help-btn-fill">Contact Customer Support</button>
            </div>
          </div>

        </div>{/* /cart-body */}
      </div>

      {/* ═══ CARD MODAL ═══ */}
      {cardOpen && (
        <div className="modal-backdrop" style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}>
          <div className="modal-card" style={{ width: 860, borderRadius: 32, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", display: "flex" }}>
            {/* Left: artwork */}
            <div style={{ width: "48%", position: "relative" }}>
              <img src={art?.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 60%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, padding: 36, color: "#fff" }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Artwork</p>
                <h2 style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "1.7rem", margin: "0 0 6px", lineHeight: 1.2 }}>{art?.title}</h2>
                <p style={{ color: "rgba(255,255,255,0.55)", margin: "0 0 12px", fontFamily: "'Inria Sans',sans-serif", fontSize: "0.9rem" }}>{art?.category}</p>
                <p className="price-gold" style={{ fontFamily: "'Inria Sans',sans-serif", fontSize: "1.7rem", fontWeight: 700, margin: 0 }}>₹{(quantity * (art?.price || 0)).toLocaleString("en-IN")}</p>
              </div>
            </div>
            {/* Right: form */}
            <div style={{ width: "52%", background: "#fafaf8", padding: "44px 44px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <button onClick={() => setCardOpen(false)} style={{ position: "absolute", top: 22, right: 22, background: "none", border: "none", cursor: "pointer", color: "#999", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#000"} onMouseLeave={e => e.currentTarget.style.color = "#999"}><X size={26} /></button>
              <div>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>Checkout</p>
                <h2 style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "1.7rem", color: "#111", margin: "0 0 28px" }}>Complete Purchase</h2>
                {[
                  { label: "Card Number", value: cardNumber, onChange: e => setCardNumber(e.target.value.replace(/\D/g, "")), placeholder: "1234 5678 9012 3456" },
                  { label: "Card Holder", value: cardHolder, onChange: e => setCardHolder(e.target.value.replace(/[^A-Za-z ]/g, "")), placeholder: "Your Name" },
                ].map(({ label, value, onChange, placeholder }) => (
                  <div key={label} style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontFamily: "'DM Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>{label}</label>
                    <input type="text" value={value} onChange={onChange} placeholder={placeholder}
                      style={{ width: "100%", borderBottom: "1px solid #ddd", padding: "10px 0", outline: "none", background: "transparent", fontFamily: "'Inria Sans',sans-serif", fontSize: "1rem", color: "#111", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "#111"}
                      onBlur={e => e.target.style.borderColor = "#ddd"}
                    />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 20 }}>
                  {[
                    { label: "Expiry", value: expiry, onChange: e => { let v = e.target.value.replace(/\D/g,""); if(v.length>2) v=v.slice(0,2)+"/"+v.slice(2); setExpiry(v); }, placeholder: "MM/YY" },
                    { label: "CVV", value: cvv, onChange: e => setCvv(e.target.value.replace(/\D/g,"")), placeholder: "•••", type: "password" },
                  ].map(({ label, value, onChange, placeholder, type }) => (
                    <div key={label} style={{ flex: 1 }}>
                      <label style={{ display: "block", fontFamily: "'DM Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>{label}</label>
                      <input type={type || "text"} value={value} onChange={onChange} placeholder={placeholder}
                        style={{ width: "100%", borderBottom: "1px solid #ddd", padding: "10px 0", outline: "none", background: "transparent", fontFamily: "'Inria Sans',sans-serif", fontSize: "1rem", color: "#111", transition: "border-color 0.2s" }}
                        onFocus={e => e.target.style.borderColor = "#111"}
                        onBlur={e => e.target.style.borderColor = "#ddd"}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button onClick={() => setCardOpen(false)} style={{ flex: 1, border: "1px solid #ddd", background: "none", padding: "14px", borderRadius: 100, fontFamily: "'Inria Sans',sans-serif", fontSize: "0.95rem", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>Cancel</button>
                <button onClick={handleOrder} style={{ flex: 1, background: "#111", color: "#fff", border: "none", padding: "14px", borderRadius: 100, fontFamily: "'Inria Sans',sans-serif", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>Purchase</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ UPI MODAL ═══ */}
      {upiOpen && (
        <div className="modal-backdrop" style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}>
          <div className="modal-card" style={{ width: 900, borderRadius: 40, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", display: "flex", position: "relative" }}>
            <button onClick={() => setUpiOpen(false)} style={{ position: "absolute", top: 24, right: 24, zIndex: 60, background: "none", border: "none", cursor: "pointer", color: "#999", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#999"}><X size={28} /></button>

            {/* Left dark panel */}
            <div style={{ width: "55%", background: "linear-gradient(135deg,#111,#1a1a1a)", padding: "52px 48px", color: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 280, height: 280, background: "rgba(97,172,189,0.12)", borderRadius: "50%", filter: "blur(80px)", top: -80, left: -80 }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Secure Payment</p>
                <h1 style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "2.4rem", lineHeight: 1.15, marginBottom: 36 }}>Scan & Pay<br />with any UPI app</h1>
                <div style={{ background: "#fff", padding: 20, borderRadius: 20, display: "inline-block", position: "relative" }}>
                  <QRCode value="upi://pay?pa=artvista@upi&pn=ArtVista&am=1604" size={220} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", padding: 4, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
                      <img src="/ArtVista.png" alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Total Payment</p>
                  <p className="price-gold" style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "2.4rem", margin: 0 }}>₹{(quantity * (art?.price || 0) + 105).toLocaleString("en-IN")}</p>
                </div>
                <div style={{ marginTop: 24 }}>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: 12, textTransform: "uppercase" }}>Supported Apps</p>
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    {["/Icons/gpay.png", "/Icons/phonePe.png", "/Icons/paytm.png", "/Icons/bhim.png"].map((src, i) => (
                      <img key={i} src={src} alt="" style={{ height: 32, objectFit: "contain", opacity: 0.75, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity="1"} onMouseLeave={e => e.currentTarget.style.opacity="0.75"} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right light panel */}
            <div style={{ width: "45%", background: "#f8f8f7", padding: "52px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32 }}>
                  <img src={art?.imageUrl} alt={art?.title} style={{ width: 72, height: 72, borderRadius: 16, objectFit: "cover", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }} />
                  <div>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#aaa", marginBottom: 4 }}>Artwork</p>
                    <h2 style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "1.1rem", color: "#111", margin: "0 0 4px" }}>{art?.title}</h2>
                    <p style={{ fontFamily: "'Inria Sans',sans-serif", fontSize: "0.8rem", color: "#888", margin: 0 }}>{art?.category} · {art?.year}</p>
                  </div>
                </div>
                <div style={{ background: "#fff", borderRadius: 24, padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
                  <h3 style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "1.1rem", color: "#111", margin: "0 0 20px" }}>Payment Summary</h3>
                  {[
                    { label: "Artwork Price", val: `₹${(art?.price || 0).toLocaleString("en-IN")}` },
                    { label: "Shipping", val: "₹105" },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontFamily: "'Inria Sans',sans-serif", fontSize: "0.95rem", color: "#555" }}>
                      <span>{label}</span><span style={{ fontWeight: 600, color: "#111" }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "1.1rem", color: "#111" }}>Total</span>
                    <span style={{ fontFamily: "'Jockey One',sans-serif", fontSize: "1.5rem", color: "#1a6ee6" }}>₹{(quantity * (art?.price || 0) + 105).toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div style={{ marginTop: 16, background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: 20, padding: "14px 18px", display: "flex", gap: 12 }}>
                  <ShieldCheck size={22} style={{ color: "#2563eb", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontFamily: "'Inria Sans',sans-serif", fontWeight: 700, color: "#1e3a8a", margin: "0 0 2px", fontSize: "0.9rem" }}>Secure UPI Transaction</p>
                    <p style={{ fontFamily: "'Inria Sans',sans-serif", fontSize: "0.78rem", color: "#3b82f6", margin: 0 }}>Payment encrypted and verified.</p>
                  </div>
                </div>
              </div>
              <button onClick={handleOrder}
                style={{ width: "100%", padding: "16px", borderRadius: 20, background: "#111", color: "#fff", border: "none", fontFamily: "'Jockey One',sans-serif", fontSize: "1.05rem", cursor: "pointer", marginTop: 20, transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.015)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Verify Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckOut;