import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import CurrentOrders from './order/CurrentOrders';
import CartOrders from './order/CartOrders';
import AllOrders from './order/AllOrders';
import ContactSupportModal from "./ContactSupportModal ";
import TrackingModal from './order/TrackingModal';

import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from '../../util/animations';

const Orders = () => {

   const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [supportOpen, setSupportOpen] = useState(false);

    const token = localStorage.getItem("token");

    const [cart, setCart] = useState({ items: [] });
    const [currentOrders, setCurrentOrder] = useState([]);
    const [allOrder,setAllOrder] = useState([]);

    const [activeTab, setActiveTab] = useState("current");

    useEffect(() => {

        const fetchCurrentCart = async () => {

            try{
              setLoading(true); 

                const res = await fetch(
                  "http://localhost:8080/api/orders/current",
                  {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const data = await res.json();

                setCurrentOrder(data);

            } catch (err) {
                console.error(err);
            }finally {
            setLoading(false);  // ADD
        }
        };

        const fetchCartItems = async () => {

            try {
              setLoading(true); 

                const res = await fetch(
                  "http://localhost:8080/api/cart/my",
                  {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const data = await res.json();

                setCart(data);

            } catch (err) {
                console.error(err);
            }finally {
            setLoading(false);  // ADD
        }
        };

        const fetchAllOrders = async () => {

            try{
              setLoading(true); 

                const res = await fetch(
                  "http://localhost:8080/api/orders/my",
                  {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const data = await res.json();

                setAllOrder(data);

            } catch (err) {
                console.error(err);
            }finally {
            setLoading(false);  // ADD
        }
        };

        fetchCurrentCart();
        fetchCartItems();
        fetchAllOrders();

    }, [token]);

    const handleRemoveCartItem = async (artworkId) => {

        try {

            const res = await fetch(
              `http://localhost:8080/api/cart/remove?artworkId=${artworkId}`,
              {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
              }
            );

            if (res.ok) {

                const updatedCart =
                  await res.json();

                setCart(updatedCart);
            }

        } catch (err) {
            console.error(err);
        }
    };
return (
    <div>
      <div className="flex flex-col w-full max-w-8xl h-auto my-20">
        {/* TABS */}
        <motion.div variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex justify-around items-center font-['Jockey_One'] text-2xl tracking-wide bg-[#C8EFE4] rounded-3xl h-14">
          <h1
            onClick={() => setActiveTab("current")}
            className={
              activeTab === "current"
                ? "text-black underline"
                : "cursor-pointer"
            }
          >
            Current
          </h1>

          <h1
            onClick={() => setActiveTab("cart")}
            className={
              activeTab === "cart"
                ? "text-black underline"
                : "cursor-pointer"
            }
          >
            Cart
          </h1>

          <h1
            onClick={() => setActiveTab("allOrders")}
            className={
              activeTab === "allOrders"
                ? "text-black underline"
                : "cursor-pointer"
            }
          >
            All Orders
          </h1>
        </motion.div>
        <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >

        {/* CURRENT */}
        {activeTab === "current" && (
          <CurrentOrders
            loading={loading}
            currentOrders={currentOrders}
            setSelectedOrder={setSelectedOrder}
            setSupportOpen={setSupportOpen}
          />
        )}

        {/* CART */}
        {activeTab === "cart" && (
          <CartOrders
           loading={loading}
            cart={cart}
            handleRemoveCartItem={handleRemoveCartItem}
          />
        )}

        {/* ALL ORDERS */}
        {activeTab === "allOrders" && (
          <AllOrders
            loading={loading}
            allOrder={allOrder}
          />
        )}
        </motion.div>
        </AnimatePresence>
      </div>

      <ContactSupportModal
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
        onSubmit={(msg) => {
          console.log("Support message:", msg);
        }}
      />

      <TrackingModal
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
    </div>
  )
}

export default Orders;