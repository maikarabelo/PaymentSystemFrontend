import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInactivityLogout from './useInactivityLogout';


function Dashboard() {
    
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        localStorage.removeItem('fullName');
        localStorage.removeItem('accountNumber');
        localStorage.removeItem('idNumber');
        navigate('/login'); // Redirect to login
    };

    const goToPayment = () => {
        navigate('/paymentForm');
    };
   
    useInactivityLogout(300000); // 5 minutes
    var userId = localStorage.getItem('userId');
    useEffect(() => {
        fetch(`https://paymentsystem-4svt.onrender.com/api/payments/getByUserId/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // If using JWT
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch payments');
                return res.json();
            })
            .then(data => {
                setPayments(data);
                localStorage.setItem('payments', JSON.stringify(data)); // Optional: cache
            })
            .catch(error => {
                console.error('Error fetching payments:', error);
            });
    }, []);
    return (
        <div className="container-fluid">
            <nav class="navbar navbar-expand-lg bg-primary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Payment System</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarText">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                           
                        </ul>
                        <span class="navbar-text">
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        </span>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h1 className="text-center">Welcome {localStorage.getItem('fullName')}</h1>
                <h3>Account number : {localStorage.getItem('accountNumber')}</h3>
                <h3>ID number : {localStorage.getItem('idNumber')}</h3>
                <button type="button" class="btn btn-primary" onClick={goToPayment}>Make Payment</button>

                <h2 className="mt-4">Your Payments</h2>
                {payments.length === 0 ? (
                    <p>No payments found.</p>
                ) : (
                    <table className="table table-bordered mt-3">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Sender Account No</th>
                                <th>Receiver Account No</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Provider</th>
                                <th>Swift Code</th>
                                <th>Status</th>   
                                <th>Created At</th>  
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td>{payment.id}</td>
                                    <td>{payment.senderAccount}</td>
                                    <td>{payment.receiverAccount}</td>
                                    <td>{payment.amount.toFixed(2)}</td>
                                    <td>{payment.currency}</td>
                                    <td>{payment.provider}</td>
                                    <td>{payment.swiftCode}</td>
                                    <td>{payment.status}</td>
                                    <td>{new Date(payment.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
