import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useInactivityLogout from './useInactivityLogout';

function PaymentForm() {
    const [payment, setPayment] = useState({
        userId: localStorage.getItem('userId') || '',
        receiverAccount: '',
        senderAccount: '',
        amount: '',
        currency: 'USD',
        swiftCode: '',
        provider: 'SWIFT'
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setPayment(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:8080/api/payments/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payment)
            });

            const data = await response.text(); // or use .json() if your backend returns JSON

            if (response.ok) {
                setMessage(data + " Redirecting in 5 Secons!");
                setTimeout(() => {
                    navigate("/dashboard"); // Redirect to dashboard after payment
                }, 5000);
            } else {
                setMessage("Error submitting payment.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Error submitting payment.");
        }
    };

    const handleClick = () => {
        navigate('/login');
    };

    useInactivityLogout(300000); // 5 minutes

    return (
        <div className="container mt-5">
            {message && <div className="alert alert-info mt-3">{message}</div>}
            <h2>International Payment</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <div className="mb-3">
                    <label className="form-label">Receiver Account</label>
                    <input
                        type="text"
                        name="receiverAccount"
                        className="form-control"
                        value={payment.receiverAccount}
                        onChange={handleChange}
                        pattern="^\d{10,20}$"
                        title="10 to 20 digit account number"
                        required
                    />
                </div>

                <input
                    type="hidden"
                    name="userId"
                    value={payment.userId}
                />

                <div className="mb-3">
                    <label className="form-label">Sender Account</label>
                    <input
                        type="text"
                        name="senderAccount"
                        className="form-control"
                        value={payment.senderAccount}
                        onChange={handleChange}
                        pattern="^\d{10,20}$"
                        title="10 to 20 digit account number"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="text"
                        name="amount"
                        pattern="^\d+(\.\d{2})?$"
                        className="form-control"
                        value={payment.amount}
                        onChange={handleChange}
                        title="Enter a valid amount (e.g. 1000 or 1000.50)"
                        required
                        min="1"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Currency</label>
                    <select
                        name="currency"
                        className="form-select"
                        value={payment.currency}
                        onChange={handleChange}
                    >
                        <option value="USD">USD</option>
                        <option value="ZAR">ZAR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BWP">BWP</option>
                        <option value="NAD">NAD</option>
                        <option value="SZL">SZL</option>
                        <option value="MZN">MZN</option>
                        <option value="MZN">ZWL</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Provider</label>
                    <select
                        name="provider"
                        className="form-select"
                        value={payment.provider}
                        onChange={handleChange}
                    >
                        <option value="SWIFT">SWIFT</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">SWIFT Code</label>
                    <input
                        type="text"
                        name="swiftCode"
                        className="form-control"
                        value={payment.swiftCode}
                        onChange={handleChange}
                        pattern="^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$"
                        title="Enter Valid SWIFT code e.g. FIRNZAJJ"
                        required
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Pay Now</button>
                </div>
                <button type="button" class="btn btn-danger mt-2" onClick={handleClick}>Cancel</button>
            </form>
        </div>
    );
}

export default PaymentForm;
