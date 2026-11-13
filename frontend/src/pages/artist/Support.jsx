import React from 'react'
import ArtistHeader from './ArtistHeader'
import ArtistSidebar from './ArtistSidebar'

const Support = () => {
  return (
    <div>

      <ArtistHeader />

      <div className="flex">

        <ArtistSidebar />
          <div className="my-25 mx-15 flex flex-col mr-10 text-2xl w-full h-auto my-25"> 
            <div className="flex justify-between mx-10">
            <h2 className="text-white font-['Lilita_One'] text-5xl">Help Center</h2>
            <p className="text-white font-['Inika'] text-3xl"> (FAQ'S) </p>
            </div>
            <h2 className="text-white font-['Inika'] font-bold text-3xl mx-10 mt-10">HOW CAN WE HELP YOU?</h2>
            <h2 className="text-white font-['Figtree'] font-bold text-2xl mx-10 mt-13">What image formats are supported when uploading artwork? </h2>
            <p className="text-white font-['Inika'] mx-10 mt-2">JPEG and PNG are recommended. PNG is best for graphics with transparency, while JPEG works well for photos. Keep file sizes under 5 MB for faster uploads.</p>
            <h2 className="text-white font-['Figtree'] font-bold text-2xl mx-10 mt-13">How do I update the status of an order?  </h2>
            <p className="text-white font-['Inika'] mx-10 mt-2">Go to the Orders tab, select the order, and choose Mark as Shipped, Delivered, or Cancelled. Buyers will be notified automatically.</p>
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

export default Support
