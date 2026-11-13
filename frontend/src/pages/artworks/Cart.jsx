import React, { useEffect, useState } from "react";
import { FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdAttachMoney, MdSecurity } from "react-icons/md";
import { FaStar, FaSmile, FaLock } from "react-icons/fa";
import { FaBattleNet } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../../components/BackButton";

/* ─── Inline styles / keyframes injected once ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

  :root {
    --bg:        #100D0D;
    --surface:   #111111;
    --surface2:  #161616;
    --border:    rgba(201,168,76,0.18);
    --gold:      #76c8d6;
    --gold-dim:  rgba(96, 161, 180, 0.55);
    --text:      #e8e2d9;
    --text-mid:  #6b6560;
    --text-soft: #3a3835;
    --white:     #f5f0e8;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse-ring {
    0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.35); }
    50%      { box-shadow: 0 0 0 14px rgba(201,168,76,0); }
  }
  @keyframes glow-in {
    from { opacity: 0; text-shadow: 0 0 40px var(--gold); }
    to   { opacity: 1; text-shadow: none; }
  }

  .cart-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Cormorant Garamond', serif;
    color: var(--text);
    padding-bottom: 120px;
  }

  /* ── Header band ── */
  .cart-header {
    border-bottom: 1px solid var(--border);
    padding: 36px 64px 28px;
    display: flex;
    align-items: baseline;
    gap: 20px;
    background: var(--bg);
    animation: fadeUp 0.5s ease both;
  }
  .cart-header h1 {
    font-size: clamp(2.2rem, 4vw, 3.4rem);
    font-weight: 300;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text);
    margin: 0;
    animation: glow-in 0.9s ease both;
  }
  .cart-header .sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: var(--gold);
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  /* ── Main layout ── */
  .cart-body {
    max-width: 1240px;
    margin: 0 auto;
    padding: 56px 40px 0;
  }

  /* ── Empty state ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 120px 40px;
    animation: fadeUp 0.6s ease both;
  }
  .empty-icon-wrap {
    width: 100px; height: 100px;
    border: 1px solid var(--gold-dim);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    animation: spin-slow 12s linear infinite;
  }
  .empty-state h2 {
    font-size: 2.4rem;
    font-weight: 300;
    letter-spacing: 0.06em;
    color: var(--text);
    margin: 0;
  }
  .empty-state p {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.15em;
    color: var(--text-mid);
    margin: 0;
  }
  .explore-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: var(--gold);
    color: #080808;
    border: none;
    padding: 16px 40px;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s, gap 0.25s;
  }
  .explore-btn:hover { background: var(--white); gap: 20px; }

  /* ── Cart item card ── */
  .cart-item {
    display: grid;
    grid-template-columns: 340px 1fr;
    border: 1px solid var(--border);
    margin-bottom: 40px;
    background: var(--surface);
    animation: fadeUp 0.55s ease both;
    transition: border-color 0.3s, box-shadow 0.3s;
    overflow: hidden;
  }
  .cart-item:hover {
    border-color: var(--gold-dim);
    box-shadow: 0 0 48px rgba(201,168,76,0.06);
  }
  .cart-item-img {
    width: 100%;
    height: 420px;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
    filter: brightness(0.92);
  }
  .cart-item:hover .cart-item-img { transform: scale(1.03); filter: brightness(1); }
  .cart-item-img-wrap { overflow: hidden; }

  .cart-item-body {
    padding: 48px 52px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: var(--surface);
  }

  .item-top {}
  .item-index {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.25em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .item-title {
    font-size: clamp(1.8rem, 2.5vw, 2.6rem);
    font-weight: 400;
    line-height: 1.15;
    color: var(--text);
    margin-bottom: 28px;
    font-style: italic;
  }
  .item-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 32px;
    margin-bottom: 32px;
  }
  .meta-row {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-mid);
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .meta-row span:last-child {
    color: var(--text);
    font-weight: 400;
  }

  /* ── Gold divider ── */
  .gold-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--gold) 0%, transparent 100%);
    margin: 28px 0;
  }

  /* ── Price ── */
  .price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 32px;
  }
  .price-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-mid);
  }
  .price-value {
    font-size: 2.4rem;
    font-weight: 300;
    color: var(--gold);
    letter-spacing: 0.04em;
  }

  /* ── Quantity ── */
  .qty-row {
    display: flex;
    align-items: center;
    gap: 0;
    width: fit-content;
    border: 1px solid var(--border);
    margin-bottom: 36px;
  }
  .qty-btn {
    width: 44px; height: 44px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-mid);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    transition: background 0.2s, color 0.2s;
  }
  .qty-btn:hover { background: var(--gold); color: #080808; }
  .qty-display {
    width: 52px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    color: var(--text);
  }

  /* ── Actions ── */
  .item-actions {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .save-btn {
    width: 48px; height: 48px;
    border: 1px solid var(--border);
    background: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-mid);
    font-size: 1.5rem;
    transition: border-color 0.2s, color 0.2s;
  }
  .save-btn:hover {
    border-color: var(--gold);
    color: var(--gold);
    animation: pulse-ring 1.2s infinite;
  }
  .checkout-btn {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: var(--gold);
    color: #080808;
    border: none;
    padding: 15px 36px;
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s, gap 0.25s;
  }
  .checkout-btn:hover { background: var(--white); gap: 22px; }

  /* ── Trust strip ── */
  .trust-strip {
    max-width: 1240px;
    margin: 80px auto 0;
    padding: 0 40px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
    border: 1px solid var(--border);
    background: var(--surface);
    animation: fadeUp 0.6s 0.2s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  .trust-item {
    padding: 44px 32px;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: background 0.2s;
  }
  .trust-item:last-child { border-right: none; }
  .trust-item:hover { background: var(--surface2); }
  .trust-icon {
    color: var(--gold);
    font-size: 1.6rem;
  }
  .trust-title {
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: var(--text);
    line-height: 1.2;
  }
  .trust-desc {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    color: var(--text-mid);
    line-height: 1.7;
  }

  /* ── Help bar ── */
  .help-bar {
    max-width: 1240px;
    margin: 56px auto 0;
    padding: 48px 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--border);
    background: var(--surface);
    animation: fadeUp 0.6s 0.35s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  .help-bar h3 {
    font-size: 1.9rem;
    font-weight: 300;
    letter-spacing: 0.06em;
    color: var(--text);
    margin: 0;
    font-style: italic;
  }
  .help-btns {
    display: flex;
    gap: 16px;
  }
  .help-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--gold);
    color: #080808;
    border: none;
    padding: 14px 32px;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s;
  }
  .help-btn-primary:hover { background: var(--white); }
  .help-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: none;
    color: var(--text);
    border: 1px solid var(--border);
    padding: 14px 32px;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s, color 0.25s, border-color 0.25s;
  }
  .help-btn-outline:hover { background: var(--gold); color: #080808; border-color: var(--gold); }
`;

const Cart = () => {
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState({ items: [] });
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/cart/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCart(data);
        // Init per-item quantities
        const init = {};
        (data.items || []).forEach((item) => { init[item.artworkId] = 1; });
        setQuantities(init);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCartItems();
  }, [token]);

  const getQty = (id) => quantities[id] ?? 1;
  const changeQty = (id, delta) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));

  const handleSaved = async (artworkId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/artworks/saved?artworkId=${encodeURIComponent(artworkId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ artworkId }),
        }
      );
      if (!res.ok) {
        toast.error("Failed to save artwork", { description: "Please try again later." });
        return;
      }
      toast.success("Saved", { description: "Artwork added to your saved list." });
    } catch (err) {
      console.error(err);
    }
  };

  const trustItems = [
    {
      icon: <MdSecurity />,
      title: "No Surprise Fees",
      desc: "Total price is final — taxes, duties & fees included.",
    },
    {
      icon: <FaStar />,
      title: "Five-Star Reviews",
      desc: "World-class customer service, every order.",
    },
    {
      icon: <FaSmile />,
      title: "Free 14-day Returns",
      desc: "Shop with complete confidence.",
    },
    {
      icon: <FaLock />,
      title: "Safe & Secure",
      desc: "All transactions are end-to-end encrypted.",
    },
    {
      icon: <MdAttachMoney />,
      title: "Support An Artist",
      desc: "Artists earn more on every single sale.",
    },
  ];

  return (
    <>
      <style>{globalStyles}</style>

      <div className="cart-root">
        <div className="flex flex-col mx-7 mt-7 -mb-3">
        <BackButton/>
        <div className="cart-header">
          <h1>Your Cart</h1>
          <span className="sub">
            {cart.items.length} {cart.items.length === 1 ? "piece" : "pieces"} selected
          </span>
        </div>
        </div>

        <div className="cart-body">
          {/* Empty state */}
          {cart.items.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <FaBattleNet style={{ fontSize: "2.4rem", color: "var(--gold)" }} />
              </div>
              <h2>Your collection awaits</h2>
              <p>No works in cart — discover something extraordinary</p>
              <Link to="/buyer/browse">
                <button className="explore-btn">
                  Explore Artworks <FiArrowRight />
                </button>
              </Link>
            </div>
          )}

          {/* Cart items */}
          {cart.items.map((item, index) => {
            const qty = getQty(item.artworkId);
            return (
              <div
                key={item.artworkId}
                className="cart-item"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                {/* Image */}
                <div className="cart-item-img-wrap">
                  <img
                    className="cart-item-img"
                    src={item.imageUrl}
                    alt={item.title}
                  />
                </div>

                {/* Body */}
                <div className="cart-item-body">
                  <div className="item-top">
                    <div className="item-index">
                      Work {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="item-title">{item.title}</div>

                    <div className="item-meta">
                      <div className="meta-row">
                        <span>Category</span>
                        <span>{item.category}</span>
                      </div>
                      <div className="meta-row">
                        <span>Orientation</span>
                        <span>{item.orientation}</span>
                      </div>
                      <div className="meta-row">
                        <span>Edition</span>
                        <span>{item.edition}</span>
                      </div>
                      <div className="meta-row">
                        <span>Year</span>
                        <span>{item.year}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="gold-rule" />

                    <div className="price-row">
                      <span className="price-label">Total</span>
                      <span className="price-value">
                        ₹{(item.price * qty).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="qty-row">
                      <button
                        className="qty-btn"
                        onClick={() => changeQty(item.artworkId, -1)}
                        aria-label="Decrease"
                      >
                        <FiMinus />
                      </button>
                      <div className="qty-display">{qty}</div>
                      <button
                        className="qty-btn"
                        onClick={() => changeQty(item.artworkId, 1)}
                        aria-label="Increase"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="item-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleSaved(item.artworkId)}
                        title="Save for later"
                      >
                        <CiBookmarkCheck />
                      </button>
                      <Link
                        to={`/buyer/checkout?artworkId=${item.artworkId}&quantity=${qty}`}
                      >
                        <button className="checkout-btn">
                          Proceed to Checkout <FiArrowRight />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Trust strip */}
          <div className="trust-strip">
            {trustItems.map((t, i) => (
              <div className="trust-item" key={i}>
                <div className="trust-icon">{t.icon}</div>
                <div className="trust-title">{t.title}</div>
                <div className="trust-desc">{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Help bar */}
          <div className="help-bar">
            <h3>Need assistance?</h3>
            <div className="help-btns">
              <button className="help-btn-outline">Art Advisory</button>
              <button className="help-btn-primary">
                Customer Support <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;