import { useState } from "react";
import { storage, db, ref, uploadBytes, collection, addDoc } from "../firebaseConfig";
import CryptoJS from "crypto-js";

function EncryptPage() {
  const [file, setFile] = useState(null);
  const [rfid1, setRfid1] = useState("");
  const [rfid2, setRfid2] = useState("");
  const [message, setMessage] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEncryptUpload = async () => {
    if (!file || !rfid1 || !rfid2) {
      alert("⚠️ Please select a file and enter both RFID values.");
      return;
    }

    setMessage("");
    setLoading(true);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const fileBytes = new Uint8Array(reader.result);
        const base64Data = btoa(String.fromCharCode(...fileBytes));
        const encryptedData = CryptoJS.AES.encrypt(base64Data, "SecretKey").toString();

        setEncryptedData(encryptedData);
        const half = Math.ceil(encryptedData.length / 2);
        const part1 = encryptedData.slice(0, half);
        const part2 = encryptedData.slice(half);
        setPart1(part1);
        setPart2(part2);

        await uploadBytes(ref(storage, `files/${rfid1}.txt`), new Blob([part1], { type: "text/plain" }));
        await uploadBytes(ref(storage, `files/${rfid2}.txt`), new Blob([part2], { type: "text/plain" }));

        await addDoc(collection(db, "files"), {
          rfid1,
          rfid2,
          fileName: file.name,
        });

        setMessage("✅ File Encrypted & Uploaded Successfully!");
      } catch (error) {
        console.error("Encryption error:", error);
        setMessage("❌ Error occurred during encryption.");
      }

      setLoading(false);
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>🔐 Secure File Encryption</h1>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={styles.input} />
        <input type="text" placeholder="Enter RFID 1" onChange={(e) => setRfid1(e.target.value)} style={styles.input} />
        <input type="text" placeholder="Enter RFID 2" onChange={(e) => setRfid2(e.target.value)} style={styles.input} />

        <button onClick={handleEncryptUpload} style={styles.button} disabled={loading}>
          {loading ? "Encrypting..." : "Encrypt & Upload"}
        </button>

        {message && <p style={{ ...styles.message, color: message.includes("❌") ? "red" : "green" }}>{message}</p>}

        {/* Visualization */}
        {encryptedData && (
          <div style={styles.visualContainer}>
            <h3>🔒 Encrypted Data:</h3>
            <div style={styles.dataBox}>{encryptedData.substring(0, 100)}...</div>

            <h3>📝 Encrypted Parts:</h3>
            <div style={styles.row}>
              <div style={styles.box}>
                <strong>Part 1:</strong> {part1.substring(0, 50)}...
              </div>
              <div style={styles.box}>
                <strong>Part 2:</strong> {part2.substring(0, 50)}...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CSS Styles
const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
    color: "#fff",
  },
  container: {
    width: "90%",
    maxWidth: "500px",
    padding: "30px",
    borderRadius: "10px",
    background: "#1E1E1E",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "#fff",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    background: "#00C853",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
    marginTop: "10px",
    fontSize: "14px",
  },
  visualContainer: {
    marginTop: "20px",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  box: {
    flex: 1,
    padding: "10px",
    background: "#222",
    borderRadius: "5px",
    wordBreak: "break-word",
  },
  dataBox: {
    padding: "10px",
    background: "#333",
    borderRadius: "5px",
    wordBreak: "break-word",
    color: "#00C853",
  },
};

export default EncryptPage;
