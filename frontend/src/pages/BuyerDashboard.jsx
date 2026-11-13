import CustomerHeader from "./customer/CustomerHeader";
import CustomerSidebar from "./customer/CustomerSidebar";
import Orders from "./customer/Orders";

const BuyerDashboard  = () => {
  return (
    <div>
      <CustomerHeader/>
    <div className="flex flex-1">
      <CustomerSidebar/>
       <div className="flex-1 min-w-0 overflow-y-auto">  
        <Orders/>
      </div>
    </div>
  </div>
  )
}

export default BuyerDashboard 
