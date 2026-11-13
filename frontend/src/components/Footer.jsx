import { FaInstagram, FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#0c0c0c] text-gray-300 pt-16">

      {/* Top Section */}
      <div className="max-w-6xl mx-auto bg-linear-to-r from-[#0f2a2a] to-[#122020] rounded-3xl p-12">

        {/* Header */}
        <div className="flex items-start gap-6 mb-10">
          <img
            src="/ArtVista.png"
            alt="logo"
            className="w-16 h-16 rounded-full"
          />

          <div>
            <h2 className="text-3xl font-['Nosifer'] text-white tracking-wider ">
              ARTVISTA MARKET
            </h2>

            <p className="text-sm mt-2 text-gray-400">
              ART BEYOND THE FRAME
            </p>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300">
              Discover original artworks from verified artists and curated
              galleries around the world. ArtVista brings together creativity,
              authenticity, and secure commerce—so every purchase feels
              meaningful.
            </p>
          </div>
        </div>


        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4">EXPLORE</h3>
            <ul className="space-y-2 text-sm">
              <li>Gallery</li>
              <li>Featured Collections</li>
              <li>Trending Artworks</li>
              <li>New Arrivals</li>
            </ul>
          </div>

          {/* Buy Art */}
          <div>
            <h3 className="text-white font-semibold mb-4">BUY ART</h3>
            <ul className="space-y-2 text-sm">
              <li>Paintings</li>
              <li>Digital Art</li>
              <li>Anime & Illustrations</li>
              <li>Cars & Concept Art</li>
              <li>Landscapes & Nature</li>
              <li>Limited Editions</li>
            </ul>
          </div>

          {/* Artists */}
          <div>
            <h3 className="text-white font-semibold mb-4">FOR ARTISTS</h3>
            <ul className="space-y-2 text-sm">
              <li>Sell Your Art</li>
              <li>Artist Dashboard</li>
              <li>Sales & Analytics</li>
              <li>Artist Verification</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">SUPPORT & TRUST</h3>
            <ul className="space-y-2 text-sm">
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Order Tracking</li>
              <li>Returns & Refunds</li>
              <li>Buyer Protection</li>
            </ul>
          </div>

        </div>


        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-6">

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-2">LEGAL</h3>
            <p className="text-sm">Terms & Conditions</p>
            <p className="text-sm">Privacy Policy</p>
            <p className="text-sm">Copyright & Authenticity</p>
          </div>


          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-center">
              CONNECT WITH US
            </h3>

            <div className="flex gap-4 text-xl justify-center">
              <FaInstagram className="cursor-pointer hover:text-pink-400"/>
              <FaXTwitter className="cursor-pointer hover:text-gray-400"/>
              <FaLinkedin className="cursor-pointer hover:text-blue-400"/>
              <FaGithub className="cursor-pointer hover:text-white"/>
            </div>
          </div>

        </div>

      </div>


      <div className="text-center pt-10 mt-10 pb-10 bg-[#161A20] font-['Michroma'] text-stone-200">
  <p className="text-2xl font-bold">© 2026 ARTVISTA MARKET</p>
  <p className="mt-4 text-xs">ALL RIGHTS RESERVED</p>
</div>

    </footer>
  );
};

export default Footer;

