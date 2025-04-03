import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔒 SentinalXYfer: Secure File Transfer</h1>
      <p style={styles.description}>
        A next-gen file-sharing system with AES encryption, NFC-based security, 
        and face authentication. Protect and share your data securely with multi-layered protection.
      </p>

      <div style={styles.buttonContainer}>
        <Link to="/encrypt">
          <button style={{ ...styles.button, ...styles.encrypt }}>Encrypt & Upload</button>
        </Link>
        <Link to="/decrypt">
          <button style={{ ...styles.button, ...styles.decrypt }}>Decrypt File</button>
        </Link>
      </div>

      <div style={styles.featuresContainer}>
        <h2 style={styles.featuresTitle}>⚡ Key Features</h2>
        <ul style={styles.featureList}>
          <li>🔑 **AES Encryption** for secure file storage.</li>
          <li>🛡 **Multi-Layer Authentication** using NFC & Face ID.</li>
          <li>📂 **Decentralized Storage** to prevent data loss.</li>
          <li>🚀 **Fast & Secure File Transfers** with end-to-end encryption.</li>
        </ul>
      </div>
    </div>
  );
}

// Inline styles for the page
const styles = {
  container: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "50px auto",
    padding: "30px",
    background: "#2c2f36",
    color: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    
    /* Centering the container */
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
}
,
  title: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  description: {
    fontSize: "16px",
    color: "#ddd",
    marginBottom: "25px",
    lineHeight: "1.5",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
  },
  encrypt: {
    background: "#6a0dad",
    color: "white",
  },
  decrypt: {
    background: "#ff4500",
    color: "white",
  },
  featuresContainer: {
    background: "#1f2228",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "20px",
  },
  featuresTitle: {
    fontSize: "22px",
    marginBottom: "10px",
  },
  featureList: {
    textAlign: "left",
    fontSize: "16px",
    lineHeight: "1.8",
    paddingLeft: "20px",
  },
};

export default Home;
