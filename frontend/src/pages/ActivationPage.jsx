import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(null); // More detailed error state
  const [success, setSuccess] = useState(false); 

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          console.log("Sending activation token:", { activation_token });
          const res = await axios.post(
            `${server}/user/activation`,
            {
              activation_token,
            },
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("Server response:", res.data.message);
          setSuccess(true);
        } catch (error) {
          console.error("Error response:", error.response); // Log the entire error response
          setError(
            error.response
              ? error.response.data.message
              : "An unexpected error occurred."
          );
        }
      };
      activationEmail();
    }
  }, [activation_token]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!success ? (
        <p>Your account has been created successfully!</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Activating your account...</p>
      )}
    </div>
  );
};

export default ActivationPage;




// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { server } from "../server";

// const ActivationPage = () => {
//   const { activation_token } = useParams();
//   const [error, setError] = useState(null); // State to store error message
//   const [success, setSuccess] = useState(false); // State to handle success message
//   const [loading, setLoading] = useState(true); // State to show loading status

//   useEffect(() => {
//     if (activation_token) {
//       const activationEmail = async () => {
//         try {
//           console.log("Sending activation token:", { activation_token });

//           const res = await axios.post(
//             `${server}/user/activation`,
//             { activation_token },
//             { headers: { "Content-Type": "application/json" } }
//           );

//           console.log("Server response:", res.data.message);
//           setSuccess(true);
//           setError(null); // Clear error state if successful
//         } catch (error) {
//           console.error("Error response:", error.response);
//           setError(
//             error.response?.data?.message || "An unexpected error occurred."
//           );
//           setSuccess(false); // Ensure success is false in case of error
//         } finally {
//           setLoading(false); // Stop the loading indicator
//         }
//       };
//       activationEmail();
//     }
//   }, [activation_token]);

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {loading ? (
//         <p>Activating your account...</p>
//       ) : error ? (
//         <p style={{ color: "red" }}>{error}</p>
//       ) : success ? (
//         <p style={{ color: "green" }}>
//           Your account has been activated successfully!
//         </p>
//       ) : (
//         <p>Unexpected state. Please try again.</p>
//       )}
//     </div>
//   );
// };

// export default ActivationPage;
