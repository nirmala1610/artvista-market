import React from 'react'
import CustomerHeader from './CustomerHeader'
import CustomerSidebar from './CustomerSidebar'

const CustomerSupport = () => {
  return (
    <div>
      <CustomerHeader/>
     <div className="flex">
      <CustomerSidebar/>
      <div className="my-25 mx-15 flex flex-col mr-10 text-2xl w-full h-auto my-25"> 
            <div className="flex justify-between mx-10">
            <h2 className="text-white font-['Lilita_One'] text-5xl">Help Center</h2>
            <p className="text-white font-['Inika'] text-3xl"> (FAQ'S) </p>
            </div>
            <h2 className="text-white font-['Inika'] font-bold text-3xl mx-10 mt-10">HOW CAN WE HELP YOU?</h2>
            <h2 className="text-white font-['Figtree'] font-bold text-2xl mx-10 mt-13">How do I track my order status?</h2>
            <p className="text-white font-['Inika'] mx-10 mt-2">Go to the Orders tab in your dashboard. Each order will show whether it is Shipped, Delivered, or Cancelled. You’ll also receive automatic notifications when the status changes.</p>
            <h2 className="text-white font-['Figtree'] font-bold text-2xl mx-10 mt-13">Who handles shipping?</h2>
            <p className="text-white font-['Inika'] mx-10 mt-2">Artists are responsible for packaging and shipping their artwork. Courier details and tracking numbers will be added to your order once shipped, so you can follow delivery progress.</p>
            <h2 className="text-white font-['Figtree'] font-bold text-2xl mx-10 mt-13">Does the platform take a commission?  </h2>
            <p className="text-white font-['Inika'] mx-10 mt-2">Yes, a small percentage is deducted from each sale. You can view the breakdown in the Commission Report under Analytics.</p>
            <h2 className="text-white font-['Figtree'] font-bold text-2xl mx-10 mt-13"> Do I need to arrange shipping myself?  </h2>
            <p className="text-white font-['Inika'] mx-10 mt-2">Yes, artists are responsible for packaging and shipping. You can add courier details and tracking numbers in the order details.</p>
            <h2 className="text-white font-['Figtree'] font-bold text-2xl mx-10 mt-13">How can I contact a buyer?  </h2>
            <p className="text-white font-['Inika'] mx-10 mt-2"> Use the Messages section in the order details. All communication is logged for transparency.</p>
          </div>
    </div>
    </div>
  )
}

export default CustomerSupport
