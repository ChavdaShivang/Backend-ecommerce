import StripeCheckout from "react-stripe-checkout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";

const KEY =
	"pk_test_51PUkEKRsIaeOUnNcfEuyOHeC5v8p8xe86Vju5PtQNXauxUA0pdAYH6fMg8hmUTPsNhTt9rNp5i2xor7Xo2zAX9Hg00mDzCCzbR";
const Pay = () => {
	const [stripeToken, setStripeToken] = useState(null);
  const history = useNavigate();

	const onToken = (token) => {
		setStripeToken(token)
	};

	useEffect(() => {
		const makeRequest = async () => {
			try {
				const res = await axios.post(
					"http://localhost:5000/api/checkout/payment",
					{
						tokenId: stripeToken.id,
						amount: 2000,
					}
				);
        history('/success');
			} catch (err) {
				console.log(err);
			}
		};
		stripeToken && makeRequest();
	}, [stripeToken, history]);

	return (
		<div
			style={{
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<StripeCheckout
				name="My Shop"
				image="https://plus.unsplash.com/premium_vector-1683134288584-d2d5f6d714d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNob3AlMjBzdG9yZSUyMGxvZ298ZW58MHx8MHx8fDA%3D"
				billingAddress
				shippingAddress
				description="Your total is 20 $"
				amount={2000}
				token={onToken}
				stripeKey={KEY}
			>
				<button
					style={{
						border: "none",
						width: 120,
						borderRadius: 5,
						padding: "20px",
						backgroundColor: "black",
						color: "white",
						fontWeight: "600",
						cursor: "pointer",
					}}
				>
					Pay Now
				</button>
			</StripeCheckout>
		</div>
	);
};

export default Pay;
