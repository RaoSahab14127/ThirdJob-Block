
    import React, { useEffect, useState, useContext } from "react";
    import "./Pay.scss";
    import { loadStripe } from "@stripe/stripe-js";
    import { Elements } from "@stripe/react-stripe-js";
    import newRequest from "../../utils/newRequest";
    import { useParams } from "react-router-dom";
    import { useQuery } from "@tanstack/react-query";
    import { useNavigate } from "react-router-dom";
    import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
    import UserContext from "../../../src/context/userContext";
    import {ethers} from "ethers";
  const cABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "approveOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "completeOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "OrderApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "OrderCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "OrderPlaced",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_freelancer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "placeOrder",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orderExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "freelancer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum FreelanceContract.OrderStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
  const Cadd = "0x977Cc9570a70aBecA5Db9D99726C7f98FCcbDb86";

    const stripePromise = loadStripe(
      "pk_test_51NeiR1JfYpbhw17HLoO0olVtTUHQoxIrKiVl0EAgJYC6NWHlXVFfdY55OjdUNn8yTlIOJIri1s8ogliPbw3prxNq00yXDoz1wk"
    );
    
    const Pay = () => {
      const [clientSecret, setClientSecret] = useState("");
      const navigate = useNavigate();
      const { id } = useParams();
      const { setSign, sign } = useContext(UserContext);
     
    
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
          console.log(sign)
          const dep = new ethers.Contract(Cadd, cABI, sign);
          let contratdep = await dep;
          const domain_apply1 = await contratdep.placeOrder(("0x6036Bf5E03Cd168e825D39D3bb6656279231708a", data._id), {
            value: ethers.utils.parseEther(("0.00003")),
          });
          alert("Payment Succesfully paid")
          navigate("/");
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
    
