import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [credentials, setCredentials] = useState({
        accountNumber: "",
        password: ""
    });

    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleClick = () => {
        navigate('/');
    };

    useEffect(() => {
        // If already logged in, redirect to dashboard
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://paymentsystem-4svt.onrender.com/auth/customer/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
                responseType: "json"
            });

            let data = await response.text();
            let parsedData = JSON.parse(data);

            if (response.ok) {
                console.log(parsedData);
                setSuccessMessage("Login successful!");

                localStorage.setItem('token', parsedData.token); 
                localStorage.setItem("fullName", parsedData.fullName);
                localStorage.setItem("accountNumber", parsedData.accountNumber); 
                localStorage.setItem("idNumber", parsedData.idNumber);
                localStorage.setItem("userId", parsedData.userId);

                setTimeout(() => {
                    navigate("/dashboard"); // Redirect to dashboard after login
                }, 2000);
            } else {
                console.log("Login failed!");
                setErrorMessage(data);
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4">
                            {successMessage ? (
                                <div className="alert alert-success mt-3" role="alert">
                                    {successMessage}
                                </div>
                            ) : errorMessage ? (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                </div>
                            ) : null}
                            <h3 className="card-title text-center mb-4">Login</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        className="form-control"
                                        placeholder="Account Number"
                                        onChange={handleChange}
                                        required
                                        pattern="^\d{10,20}$"
                                        title="Account number must be 10 to 20 digits long"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Password"
                                        onChange={handleChange}
                                        required
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$"
                                        title="Password must be at least 8 characters, include uppercase, lowercase, a digit, and a special character"
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Login
                                    </button>
                                </div>
                            </form>
                            <div class="text-center">
                                <p>Not a member? <a class="link-opacity-100" href="#" onClick={handleClick}>Register</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;