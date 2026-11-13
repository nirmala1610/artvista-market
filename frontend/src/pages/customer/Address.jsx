import React,{useEffect,useState} from 'react'
import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';
import { ImLocation } from 'react-icons/im';

const Address = () => {
    const token = localStorage.getItem("token");
    const [address,setAddress] = useState([]);
    
      
    useEffect(() => {    
    const fetchAddress = async() =>{
        try{
        const res = await fetch("http://localhost:8080/api/address/list",{
            method:"GET",
            headers:{
            Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        console.log(data);
        setAddress(data);
        }catch(err){
        console.log(err);
        }
    }
    
        fetchAddress();
    }, [token]);

  return (
    <div>
      <CustomerHeader/>
     <div className="flex">
      <CustomerSidebar/>
  <div className="w-full h-auto bg-linear-to-br from-[#dce7f1] via-[#cad8e5] to-[#b5c4d2] rounded-[40px] p-8 shadow-2xl my-20 mr-10">

    {/* Header */}
    <div className="flex items-center justify-between mb-10">

      <div>
        <h1 className="text-5xl font-black text-[#002730] font-['Jockey_One']">
          Saved Addresses
        </h1>

        <p className="text-lg text-gray-700 mt-3 font-['Figtree']">
          Your delivery locations across the universe
        </p>
      </div>

      <div className="bg-[#002730] text-white px-6 py-4 rounded-3xl shadow-xl">
        <p className="text-sm uppercase tracking-[3px] text-white/70">
          Total
        </p>

        <h2 className="text-4xl font-black font-['Jockey_One']">
          {address.length}
        </h2>
      </div>

    </div>

    {/* Empty */}
    {address.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-24">

        <div className="text-[100px]">
          📍
        </div>

        <h2 className="text-4xl font-black text-[#002730] mt-5 font-['Jockey_One']">
          No Address Found
        </h2>

        <p className="text-xl text-gray-700 mt-4 font-['Figtree']">
          Add your first delivery address
        </p>

      </div>
    ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {address.map((addr, index) => (

          <div
            key={index}
            className="bg-[#161A20] text-white rounded-[35px] p-8 shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >

            <div className="flex items-center justify-between">

              <ImLocation className="w-10 h-10 text-cyan-400" />

              <div className="bg-cyan-400/20 text-cyan-300 px-4 py-2 rounded-2xl text-lg font-bold">
                #{index + 1}
              </div>

            </div>

            {/* Title */}
            <h2 className="text-3xl font-black mt-8 font-['Jockey_One']">
              Delivery Address
            </h2>

            {/* Details */}
            <div className="mt-8 space-y-4 text-lg font-['Figtree']">

              <p>
                <span className="font-bold text-cyan-300">
                  First Name:
                </span>{" "}
                {addr.firstName}
              </p>

              <p>
                <span className="font-bold text-cyan-300">
                  Last Name:
                </span>{" "}
                {addr.lastName}
              </p>

              <p>
                <span className="font-bold text-cyan-300">
                  Phone:
                </span>{" "}
                {addr.phoneNumber}
              </p>

              <p>
                <span className="font-bold text-cyan-300">
                  Email:
                </span>{" "}
                {addr.email}
              </p>

              <p>
                <span className="font-bold text-cyan-300">
                  Address 1:
                </span>{" "}
                {addr.addressLine1}
              </p>
              {addr.addressLine2 && (
                <p>
                  <span className="font-bold text-cyan-300">
                    Address 2:
                  </span>{" "}
                  {addr.addressLine2}
                </p>
              )}
              <p>
                <span className="font-bold text-cyan-300">
                  City:
                </span>{" "}
                {addr.city}
              </p>

              <p>
                <span className="font-bold text-cyan-300">
                  State:
                </span>{" "}
                {addr.state}
              </p>

              <p>
                <span className="font-bold text-cyan-300">
                  Country:
                </span>{" "}
                {addr.country}
              </p>

              <p>
                <span className="font-bold text-cyan-300">
                  Zip Code:
                </span>{" "}
                {addr.zipcode}
              </p>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>
  </div>
    </div>
  )
}

export default Address
