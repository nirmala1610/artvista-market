const Pulse = ({ className }) => (
  <div className={`animate-pulse bg-white/30 rounded-2xl ${className}`} />
);

export const CurrentOrderSkeleton = () => (
  <div className="w-full max-w-8xl mx-auto px-4 lg:px-6 pt-4 pb-8 my-5">
    <div className="bg-gradient-to-br from-[#dce7f1] via-[#cad8e5] to-[#b5c4d2] rounded-[45px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#002730] px-8 py-7">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <Pulse className="h-10 w-64" />
            <Pulse className="h-5 w-96" />
          </div>
          <Pulse className="h-24 w-36 rounded-3xl" />
        </div>
      </div>
      {/* Cards */}
      <div className="p-6 lg:p-8 space-y-10">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white/30 rounded-[40px] overflow-hidden shadow-xl">
            <div className="px-7 py-6 border-b border-black/10 flex justify-between items-center">
              <div className="space-y-3">
                <Pulse className="h-8 w-40" />
                <Pulse className="h-5 w-72" />
              </div>
              <Pulse className="h-24 w-40 rounded-3xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-7">
              {[1, 2, 3].map((j) => (
                <Pulse key={j} className="h-24 rounded-[30px]" />
              ))}
            </div>
            <div className="px-7 pb-7">
              <div className="bg-white/50 rounded-[35px] p-5 flex gap-7">
                <Pulse className="w-72 h-96 rounded-[30px] shrink-0" />
                <div className="flex-1 space-y-4 pt-2">
                  <Pulse className="h-10 w-3/4" />
                  <Pulse className="h-5 w-1/2" />
                  <div className="grid grid-cols-2 gap-5 mt-6">
                    {[1,2,3,4].map(k => <Pulse key={k} className="h-20" />)}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Pulse className="h-14 w-44 rounded-full" />
                    <Pulse className="h-14 w-44 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CartOrderSkeleton = () => (
  <div className="w-full max-w-8xl mx-auto px-4 lg:px-6 pt-4 pb-8 my-5">
    <div className="bg-gradient-to-br from-[#d7e3ee] to-[#b8c8d8] rounded-[40px] shadow-2xl p-8">
      <div className="flex justify-between items-center mb-10">
        <Pulse className="h-10 w-48" />
        <Pulse className="h-12 w-28 rounded-2xl" />
      </div>
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-black/10 rounded-[35px] p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <Pulse className="lg:w-80 h-80 rounded-[30px] shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-3 flex-1">
                    <Pulse className="h-10 w-3/4" />
                    <Pulse className="h-5 w-1/2" />
                  </div>
                  <Pulse className="h-10 w-32 rounded-2xl ml-4" />
                </div>
                <div className="grid grid-cols-2 gap-5 mt-6">
                  {[1,2,3,4].map(k => <Pulse key={k} className="h-16 rounded-2xl" />)}
                </div>
                <div className="flex gap-4 mt-6">
                  <Pulse className="h-14 w-36 rounded-full" />
                  <Pulse className="h-14 w-36 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AllOrderSkeleton = () => (
  <div className="w-full max-w-8xl mx-auto px-4 lg:px-6 pt-4 pb-8 my-5">
    <div className="bg-gradient-to-br from-[#dce7f1] via-[#cad8e5] to-[#b5c4d2] rounded-[45px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white/20 px-8 py-6 border-b border-white/20 flex justify-between items-center">
        <div className="space-y-3">
          <Pulse className="h-10 w-56" />
          <Pulse className="h-5 w-72" />
        </div>
        <Pulse className="h-20 w-36 rounded-3xl" />
      </div>
      {/* Cards */}
      <div className="p-6 lg:p-8 space-y-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[40px] bg-white/40 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-8 py-6 border-b border-black/10">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Pulse className="h-10 w-28 rounded-2xl" />
                  <Pulse className="h-10 w-28 rounded-2xl" />
                </div>
                <Pulse className="h-5 w-80" />
              </div>
              <Pulse className="h-24 w-44 rounded-3xl" />
            </div>
            <div className="p-6 lg:p-8">
              <div className="bg-white/60 rounded-[35px] p-6 flex gap-8">
                <Pulse className="w-72 h-72 rounded-[30px] shrink-0" />
                <div className="flex-1 space-y-4">
                  <Pulse className="h-10 w-3/4" />
                  <Pulse className="h-5 w-1/2" />
                  <div className="grid grid-cols-2 gap-5 mt-6">
                    {[1,2,3,4].map(k => <Pulse key={k} className="h-20 rounded-3xl" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);