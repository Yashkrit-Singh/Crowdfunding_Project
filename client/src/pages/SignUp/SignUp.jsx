// SignUp.jsx
import { Link } from "react-router-dom";
import "./SignUp.css";
import { useState } from "react";
import useSignup from "../../hooks/useSignUp.js"; // Ensure this hook works

const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    // gender: "male", // Default value, can be changed
  });

  const { loading, signup, error } = useSignup(); // Ensure useSignup returns error

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // const handleCheckboxChange = (gender) => {
  //   setInputs((prev) => ({ ...prev, gender }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(inputs); // Call the signup function with inputs
      alert("Signup successful! Redirecting to login...");
    } catch (error) {
      console.error("Signup failed:", error); // Log any error
      alert(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={inputs.fullName}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={inputs.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={inputs.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="form-input"
              required
            />
          </div>

          {/* Gender Checkbox */}
          {/* <div className="form-group">
            <label className="form-label">Gender</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={inputs.gender === "male"}
                  onChange={() => handleCheckboxChange("male")}
                />
                Male
              </label>
              <label style={{ marginLeft: "10px" }}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={inputs.gender === "female"}
                  onChange={() => handleCheckboxChange("female")}
                />
                Female
              </label>
            </div>
          </div> */}

          <Link to="/login" className="already-account-link">
            Already have an account?
          </Link>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;











// // SignUp.jsx
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "./SignUp.css";

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//     // gender: "male",
//   });
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const response = await axios.post("/api/signup", formData);

//       // Set success message or redirect user to login page
//       setSuccess(true);
//       console.log("User signed up:", response.data);
//     } catch (error) {
//       setError(error.response.data.error || "Signup failed");
//       console.log("Signup error:", error);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-box">
//         <h1 className="signup-title">Sign Up</h1>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="Your Name"
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Username</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Username"
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter Password"
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm Password"
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="form-input"
//             >
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </div>

//           {error && <div className="error-message">{error}</div>}
//           {success && <div className="success-message">Signup successful!</div>}

//           <Link to="/login" className="already-account-link">
//             Already have an account?
//           </Link>

//           <button type="submit" className="signup-button">Sign Up</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;