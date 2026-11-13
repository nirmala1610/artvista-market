import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "sonner";
import GalleryManagerRoleCard from "../components/GalleryManagerRoleCard";

const Home = () => {
  const navigate = useNavigate();

  const slides = [
  { title: "Paintings", img: "./Collections/Paintings.jpg" },
  { title: "Photography", img: "./Collections/Photography.jpg" },
  { title: "Sculptures", img: "./Collections/Scl.jpg" },
  { title: "Drawings", img: "./Collections/Drawings.jpg" },
  { title: "Art Prints", img: "./Collections/Artpaints.jpg" },
  { title: "Anime Posters", img: "./Collections/AnimePoster.png" },
  { title: "Game Posters", img: "./Collections/GamePoster.jpg" },
  { title: "Cars", img: "./Collections/CarCol.png" },
  { title: "Concept Art", img: "./Collections/ArtPaintings.jpg" }
];

  const [index, setIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  const extendedSlides = [...slides, slides[0]]; 
   const token = localStorage.getItem("token");
  const handleCart = async () => {
  try {

    const res = await fetch(
      `http://localhost:8080/api/cart/add?artworkId=${encodeURIComponent("6a0304d79150c2b4ba3063db")}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error("Failed to add to cart", {
        description: "Please try again later."
      });

      return;
    }

    console.log(data);

    toast.success("Added to Cart", {
      description: "The artwork has been added to your cart."
    });

  } catch (err) {
    console.error(err);
    toast.success("Already in Cart", {
        description: "This artwork is already in your cart."
      });
  }
};

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index === slides.length) {
      setTimeout(() => {
        setEnableTransition(false);
        setIndex(0);
      }, 700); 
    } else {
      setTimeout(() => setEnableTransition(true), 0);
    }
  }, [index,slides.length]);

  return (
    <>
      <div className="flex justify-center mt-20">
      
      <h1 className=" text-center text-8xl uppercase font-['Nosifer'] text-white">
           ART BEYOND THE{" "}<br/>
        <span
          className="text-transparent bg-clip-text bg-center bg-cover"
          style={{ backgroundImage: "url('/Frame.png')" }}
        >
      FRAME
    </span>
    </h1>
    </div>

     <div className="flex justify-center mt-20">
      <div className="w-264 h-64 relative">
      <div className="w-264 h-24 left-0 top-0 absolute text-center justify-start text-white text-4xl font-extralight font-['Jost'] italic">Every canvas carries a story waiting to be discovered.  Step into a world where creativity knows no bounds</div>
         
<div className="flex flex-wrap gap-8 justify-center mt-28">

  {/* CREATE ARTWORK */}
  <Link to="/exhibitions">

    <button
      className="
      group relative overflow-hidden
      w-80 h-24 rounded-[32px]
      bg-linear-to-r from-slate-800 via-slate-700 to-slate-900
      border border-white/10
      shadow-2xl shadow-cyan-500/10
      flex items-center justify-center
      cursor-pointer
      transition duration-500
      hover:scale-105 hover:shadow-cyan-500/30
      "
    >

      {/* GLOW */}
      <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>

      {/* SHINE EFFECT */}
      <div className="absolute -left-40 top-0 w-40 h-full bg-white/10 rotate-12 blur-xl group-hover:left-[120%] transition-all duration-1000"></div>

      <span className="relative z-10 flex items-center gap-4 text-white text-2xl font-['Poller_One'] uppercase tracking-wide">

        View Exhibitions

      </span>

    </button>

  </Link>

  {/* DISCOVER GALLERY */}
  <Link to="/buyer/browse">

    <button
      className="
      group relative overflow-hidden
      w-80 h-24 rounded-[32px]
      bg-white
      border border-cyan-200
      shadow-2xl shadow-white/10
      flex items-center justify-center
      cursor-pointer
      transition duration-500
      hover:scale-105 hover:shadow-cyan-400/30
      "
    >

      {/* GLOW */}
      <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>

      {/* SHINE */}
      <div className="absolute -left-40 top-0 w-40 h-full bg-white/40 rotate-12 blur-xl group-hover:left-[120%] transition-all duration-1000"></div>

      <span className="relative z-10 flex items-center gap-4 text-black text-2xl font-['Poller_One'] uppercase tracking-wide">

        Discover Gallery

      </span>

    </button>

  </Link>

</div>
      </div>
      </div>

      <div className="flex justify-center mt-20">
         <div className="w-full flex justify-center gap-8 p-8">
            <Link to = "/buyer/browse">
            <div className="group w-72 h-96 relative bg-black rounded-[37px] shadow-lg overflow-hidden flex items-end justify-center -translate-y-6">
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-[37px] group-hover:scale-110 transition duration-700"
                src="./Car.png"
                alt="Cars"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
              <span className="relative text-black text-4xl font-bold font-['Lilita_One'] uppercase mb-4">
                Cars
              </span>
            </div>
            </Link>

            <Link to = "/buyer/browse">
            <div className="group w-72 h-96 relative bg-stone-500 rounded-[37px] shadow-lg overflow-hidden flex items-end justify-center translate-y-6">
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-[37px] group-hover:scale-110 transition duration-700"
                src="./Anime.jpg"
                alt="Anime"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
              <span className="relative text-white text-4xl font-['Lilita_One'] uppercase mb-4">
                Anime
              </span>
            </div>
            </Link>

            <Link to = "/buyer/browse">
            <div className="group w-72 h-96 relative bg-stone-500 rounded-[37px] shadow-lg overflow-hidden flex items-end justify-center -translate-y-6">
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-[37px] group-hover:scale-110 transition duration-700"
                src="./Landscape.jpg"
                alt="Landscape"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
              <span className="relative text-white text-4xl font-['Lilita_One'] uppercase mb-4">
                Landscape
              </span>
            </div>
            </Link>

            <Link to = "/buyer/browse">
            <div className="group w-72 h-96 relative bg-stone-500 rounded-[37px] shadow-lg overflow-hidden flex items-end justify-center translate-y-6">
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-[37px] group-hover:scale-110 transition duration-700"
                src="./MjPop.jpg"
                alt="King of Pop"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
            </div>
            </Link>
      </div>
    </div>

    <div className="mt-18 ml-6 mr-6">
         <h1 className="text-white text-left font-['Lilita_One'] text-4xl uppercase ml-10">
           Featured Collections
         </h1>
         <div className="w-full overflow-hidden mt-16">
      <Link to = "/buyer/browse">    
      <div
        className={`flex ${enableTransition ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {extendedSlides.map((slide, i) => (
          <div
            key={i}
            className="min-w-full h-162 relative rounded-[60px] overflow-hidden"
          >
            <img
              src={slide.img}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute bottom-16 left-16 text-white text-6xl font-['Manuale'] uppercase font-bold drop-shadow-lg">
              {slide.title}
            </div>
          </div>
        ))}
      </div>
      </Link>
      </div>
    </div>

<section className="max-w-[1600px] mx-auto px-6 py-32">

  <div className="relative overflow-hidden rounded-[50px] bg-[#100D0D] border border-white/10 p-10 lg:p-16">

    {/* BACKGROUND GLOW */}
    <div className="absolute -top-20 right-0 w-[450px] h-[450px] bg-purple-500/10 blur-[160px] rounded-full"></div>
    <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full"></div>

    {/* HEADER */}
    <div className="relative z-10 flex items-center justify-between flex-wrap gap-6 mb-16">

      <div>
        <p className="text-cyan-400 uppercase tracking-[8px] text-sm mb-4">
          Most Loved Creation
        </p>

        <h1 className="text-white text-6xl font-['Lilita_One'] uppercase">
          Trending Artwork
        </h1>
      </div>

      <div className="px-6 py-3 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-md">
        <p className="text-red-300 font-semibold animate-pulse">
          Trending Worldwide
        </p>
      </div>

    </div>

    {/* MAIN CONTENT */}
    <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">

      {/* IMAGE SECTION */}
      <div className="relative group">

        {/* GLOW */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] opacity-0 group-hover:opacity-100 transition duration-700 rounded-[70px]"></div>

        {/* IMAGE */}
        <img
          className="relative w-full lg:w-[520px] h-[780px] rounded-[60px] object-cover transition duration-700 group-hover:scale-[1.02]"
          src="./Treading.jpg"
          alt="Artwork"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent rounded-[60px]"></div>

        {/* FLOATING BADGE */}
        <div className="absolute top-8 left-8 px-5 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <p className="text-white font-semibold">
            Collector Favorite
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="flex flex-col justify-center text-white max-w-2xl">

        <p className="text-cyan-300 uppercase tracking-[8px] text-sm mb-6">
          Featured Masterpiece
        </p>

        <h2 className="text-7xl font-black leading-tight">
          Art Prints
        </h2>

        <p className="text-gray-300 text-xl leading-relaxed mt-8">
          A breathtaking fusion of emotion, cinematic composition,
          and futuristic storytelling. This artwork has become one of the
          most admired creations among collectors and anime art enthusiasts.
        </p>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-8 mt-12">

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6">

            <p className="text-gray-400 uppercase text-sm tracking-[4px] mb-3">
              Artist
            </p>

            <h3 className="text-3xl font-bold">
              Akira
            </h3>

          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6">

            <p className="text-gray-400 uppercase text-sm tracking-[4px] mb-3">
              Current Price
            </p>

            <h3 className="text-3xl font-bold text-cyan-300">
              $999
            </h3>

          </div>

        </div>

        {/* STATS */}
        <div className="flex gap-10 mt-10">

          <div>
            <h3 className="text-3xl font-black">
              12.8K
            </h3>
            <p className="text-gray-400">
              Likes
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-black">
              3.2K
            </h3>
            <p className="text-gray-400">
              Collectors
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-black">
              #1
            </h3>
            <p className="text-gray-400">
              Weekly Rank
            </p>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-6 mt-14">

          <Link
            to={`/buyer/checkout?artworkId=${"6a0304d79150c2b4ba3063db"}&quantity=${1}`}
          >
            <button className="px-10 py-5 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold hover:scale-105 transition duration-300 shadow-lg shadow-cyan-500/30">
              Buy Now
            </button>
          </Link>

          <button
            className="px-10 py-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-white text-xl font-semibold hover:bg-white/20 transition duration-300"
            onClick={handleCart}
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>

  </div>

</section>

<section className="max-w-[1600px] mx-auto px-6 py-32 overflow-hidden relative">

  {/* BACKGROUND GLOW */}
  <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[160px] rounded-full"></div>
  <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full"></div>

  {/* HEADING */}
  <div className="relative z-10 flex items-end justify-between mb-20">

    <div>
      <p className="text-cyan-400 uppercase tracking-[8px] text-sm mb-4">
        Creative Legends
      </p>

      <h1 className="text-white text-5xl font-['Lilita_One'] uppercase leading-tight">
        Featured Artists
      </h1>

      <p className="text-gray-400 text-lg mt-6 max-w-2xl">
        Meet the visionaries shaping the future of digital art,
        anime illustrations, cinematic worlds, and creative storytelling.
      </p>
    </div>

    {/* <button className="hidden lg:block px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 transition">
      Explore All Artists
    </button> */}

  </div>

  {/* ARTISTS */}
  <div className="relative z-10 flex gap-10 overflow-x-auto scrollbar-hide pb-6">

    {[
      {
        name: "Akira",
        role: "Digital Artist",
        img: "./Artist/artist1.jpg",
        id:8
      },
      {
        name: "Brad",
        role: "Photography",
        img: "./Artist/artist2.jpg",
        id : 9
      },
      {
        name: "Emma",
        role: "Sketches",
        img: "./Artist/artist3.jpg",
        id : 10
      },
    ].map((artist, i) => (

      <div
        key={i}
        className="group relative w-full h-[620px] rounded-[40px] overflow-hidden cursor-pointer"
      >

        {/* IMAGE */}
        <img
          src={artist.img}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        {/* BORDER GLOW */}
        <div className="absolute inset-0 border border-white/10 group-hover:border-cyan-400/50 transition duration-500 rounded-[40px]"></div>

        {/* CONTENT */}
        <div className="absolute bottom-0 p-8 w-full">

          <p className="text-cyan-300 uppercase tracking-[5px] text-sm mb-3">
            Featured Creator
          </p>

          <h2 className="text-white text-5xl font-black">
            {artist.name}
          </h2>

          <p className="text-gray-300 text-lg mt-3">
            {artist.role}
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">

          <button
            className="px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition"
            onClick={() =>
              navigate("/artist-profile", {
                state: {
                  artistId: artist.id,
                },
              })
            }
          >
            View Profile
          </button>

          </div>

        </div>

      </div>

    ))}

  </div>

</section>

      {/* CREATOR HUB */}
      <section className="max-w-[1600px] mx-auto px-6">

        <div className="w-full bg-[#100D0D] rounded-[40px] overflow-hidden relative px-10 py-14 shadow-2xl">

          <div className="absolute -top-30 -right-25 w-87.5 h-87.5 bg-purple-500/20 blur-[140px] rounded-full"></div>
          <div className="absolute -bottom-30 -left-25 w-75 h-75 bg-blue-500/20 blur-[140px] rounded-full"></div>

          <div className="relative z-10 flex items-center gap-3 mb-8">

            <h1 className="text-white text-left font-['Lilita_One'] text-5xl uppercase">
              ArtVista Creator Hub
            </h1>

          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mt-14">

            <div className="relative group">

              <div className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
                <p className="text-white text-sm font-semibold">
                  🎨 2K+ Artists Joined
                </p>
              </div>

              <img
                src="Artist.jpg"
                alt="Community"
                className="w-full h-130 object-cover rounded-[35px] transition duration-500 group-hover:scale-[1.02]"
              />

              <div className="absolute bottom-0 left-0 w-full p-8 rounded-b-[35px] bg-linear-to-t from-black/90 via-black/30 to-transparent">

                <p className="text-gray-300 text-sm tracking-widest uppercase mb-2">
                  Featured Creators
                </p>

                <h2 className="text-white text-3xl font-bold leading-tight">
                  Your Art Deserves <br />
                  A Bigger Stage
                </h2>

              </div>

            </div>

            <div className="flex flex-col justify-center text-white">

              <div className="flex items-center gap-5">

                <div className="w-7 h-7 bg-blue-300 rounded-full animate-pulse mb-7"></div>

                <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-8">
                  Join Our <span className="text-blue-400">Creative</span> Universe
                </h1>

              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-xl">
                Upload your masterpieces, build your audience, and become part of a
                growing global community of creators. From anime illustrations to
                cinematic digital art, your gallery belongs here.
              </p>

              <div className="flex flex-wrap gap-8 mb-10">

                <div>
                  <h3 className="text-3xl font-bold">12K+</h3>
                  <p className="text-gray-400 text-sm">Artworks</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">2K+</h3>
                  <p className="text-gray-400 text-sm">Artists</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">50K+</h3>
                  <p className="text-gray-400 text-sm">Collectors</p>
                </div>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link to="/apply-artist">
                  <button className="px-8 py-4 rounded-2xl bg-linear-to-r from-purple-500 to-blue-500 font-bold text-lg hover:scale-105 transition duration-300 shadow-lg shadow-purple-500/30 cursor-pointer">
                    Apply as Artist
                  </button>
                </Link>
              </div>

              <p className="text-gray-500 text-sm mt-6">
                Approval usually takes less than 24 hours
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* GALLERY MANAGER */}
      <section className="max-w-[1600px] mx-auto px-6 mt-32">
        <GalleryManagerRoleCard />
      </section>

      {/* WHY ARTVISTA */}
      <section className="max-w-[1600px] mx-auto px-6 py-32">

        <h1 className="text-white text-5xl font-['Lilita_One'] uppercase text-left mb-16">
          Why ArtVista?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          <div className="bg-slate-400 rounded-[40px] border-t-10 border-cyan-700 p-10 text-center">
            <img src="./Icons/Verified.png" className="mx-auto mb-6 w-40 md:w-56" />
            <h3 className="text-black text-3xl font-['Mallanna'] uppercase">
              Verified Artists
            </h3>
          </div>

          <div className="bg-cyan-700 rounded-[40px] border-b-10 border-slate-400 p-10 text-center">
            <img src="./Icons/Payments.png" className="mx-auto mb-6 w-40 md:w-56" />
            <h3 className="text-white text-3xl font-['Mallanna'] uppercase">
              Secure Payments
            </h3>
          </div>

          <div className="bg-cyan-700 rounded-[40px] border-b-10 border-slate-400 p-10 text-center">
            <img src="./Icons/Collections.png" className="mx-auto mb-6 w-40 md:w-56" />
            <h3 className="text-white text-3xl font-['Mallanna'] uppercase">
              Curated Collections
            </h3>
          </div>

          <div className="bg-slate-400 rounded-[40px] border-t-10 border-cyan-700 p-10 text-center">
            <img src="./Icons/Delivery.png" className="mx-auto mb-6 w-40 md:w-56" />
            <h3 className="text-black text-3xl font-['Mallanna'] uppercase">
              Insured & Tracked Delivery
            </h3>
          </div>

        </div>
      </section>

   <div className="max-w-6xl mx-auto px-6 py-20">

  <div className="relative rounded-[40px] overflow-hidden">

    <img
      src="./Icons/Arrow.png"
      className="w-full h-87 md:h-112 object-cover"
    />

    <div className="absolute inset-0 bg-black/50"></div>

    <div className="absolute inset-0 flex items-center justify-between px-16">

      <div className="text-left space-y-6 max-w-sm">

        <h3 className="text-white text-3xl font-['Lilita_One'] uppercase">
          Are you an artist?
        </h3>

        <p className="text-white font-['Myanmar_Sans_Pro'] uppercase">
          Upload your art
        </p>

        <p className="text-white font-['Myanmar_Sans_Pro'] uppercase">
          Reach collectors worldwide
        </p>
        <Link to = "/apply-artist">
        <button className="bg-white text-black px-6 py-2 rounded-full font-['Poller_One'] uppercase">
          Start Selling
        </button>
        </Link>
      </div>

      <div className="text-right space-y-6 max-w-sm">

        <h3 className="text-white text-3xl font-['Lilita_One'] uppercase">
          Looking for an art?
        </h3>

        <p className="text-white font-['Myanmar_Sans_Pro'] uppercase">
          Discover original artworks
        </p>

        <p className="text-white font-['Myanmar_Sans_Pro'] uppercase">
          Support creators
        </p>
        <Link to = "/buyer/browse">
        <button className="bg-slate-700 text-white px-6 py-2 rounded-full font-['Poller_One'] uppercase">
          Explore Gallery
        </button>
        </Link>
      </div>

    </div>

  </div>

</div>



</>
    
  );
};

export default Home;