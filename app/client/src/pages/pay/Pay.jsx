
    import React, { useEffect, useState } from "react";
    import "./Pay.scss";
    import { loadStripe } from "@stripe/stripe-js";
    import { Elements } from "@stripe/react-stripe-js";
    import newRequest from "../../utils/newRequest";
    import { useParams } from "react-router-dom";
    import { useQuery } from "@tanstack/react-query";
    import { useNavigate } from "react-router-dom";
    import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
    
    const stripePromise = loadStripe(
      "pk_test_51NeiR1JfYpbhw17HLoO0olVtTUHQoxIrKiVl0EAgJYC6NWHlXVFfdY55OjdUNn8yTlIOJIri1s8ogliPbw3prxNq00yXDoz1wk"
    );
    
    const Pay = () => {
      const [clientSecret, setClientSecret] = useState("");
      const navigate = useNavigate();
      const { id } = useParams();

     
    
      useEffect(() => {
        const makeRequest = async () => {
          try {
            const res = await newRequest.post(
              `/orders/create-payment-intent/${id}`
            );
            setClientSecret(res.data.clientSecret);
          } catch (err) {
            console.log(err);
          }
        };
        makeRequest();
      }, []);
    
      const appearance = {
        theme: 'stripe',
      };
      const options = {
        clientSecret,
        appearance,
      };
      const { isLoading, error, data } = useQuery({
        queryKey: ["gig"],
        queryFn: () =>
          newRequest.get(`/gigs/single/${id}`).then((res) => {
            return res.data;
          }),
      });
      const payviawallet =  async () => {
        
        alert(data.price + data._id)
        try {
          const res = await newRequest.post(
            `/orders/payment-via-wallet/${id}`
          );
          navigate("/orders");
        } catch (err) {
          console.log(err);
        }
        
         };
       
        
      return <div className="pay">
        {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
          <h2>OR</h2>
          <div className="wallet">
          <span>Pay via Wallet: </span> <button onClick={payviawallet}>Pay</button>  
          </div>
      </div>;
    };
    
    export default Pay;
    
