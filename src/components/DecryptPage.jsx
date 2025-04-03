import { useState } from "react";
import { storage, db, ref, getDownloadURL, getDocs, collection } from "../firebaseConfig";
import CryptoJS from "crypto-js";

function DecryptPage() {
  const [rfid1, setRfid1] = useState("");
  const [rfid2, setRfid2] = useState("");
  const [decryptedFile, setDecryptedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [mergedEncryptedData, setMergedEncryptedData] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  const handleDecrypt = async () => {
    setMessage("");
    setLoading(true);

    try {
      // Retrieve file metadata
      const filesCollection = await getDocs(collection(db, "files"));
      let foundFile = null;

      filesCollection.forEach((doc) => {
        const data = doc.data();
        if (data.rfid1 === rfid1 && data.rfid2 === rfid2) {
          foundFile = data;
        }
      });

      if (!foundFile) {
        setMessage("⚠️ No file found for the given RFID keys.");
        setLoading(false);
        return;
      }

      // Fetch encrypted file parts
      const [url1, url2] = await Promise.all([
        getDownloadURL(ref(storage, `files/${rfid1}.txt`)),
        getDownloadURL(ref(storage, `files/${rfid2}.txt`))
      ]);

      const [fetchedPart1, fetchedPart2] = await Promise.all([
        fetch(url1).then(res => res.text()),
        fetch(url2).then(res => res.text())
      ]);

      setPart1(fetchedPart1);
      setPart2(fetchedPart2);

      // Merge parts
      const fullEncryptedData = fetchedPart1 + fetchedPart2;
      setMergedEncryptedData(fullEncryptedData);

      // Decrypt
      const decryptedBytes = CryptoJS.AES.decrypt(fullEncryptedData, "SecretKey");
      const base64Decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
      setDecryptedText(base64Decrypted);

      if (!base64Decrypted) {
        setMessage("❌ Decryption failed. Please check the encryption key.");
        setLoading(false);
        return;
      }

      // Convert Base64 back to binary
      const byteCharacters = atob(base64Decrypted);
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/octet-stream" });

      setDecryptedFile(blob);
      setFileName(foundFile.fileName || "decrypted_file");
      setMessage("✅ File successfully decrypted and ready for download.");
    } catch (error) {
      console.error("Decryption error:", error);
      setMessage("❌ An error occurred during decryption.");
    }

    setLoading(false);
  };

  const handleDownload = () => {
    if (!decryptedFile) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(decryptedFile);
    link.download = fileName || "decrypted_file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>🔐 Secure File Decryption</h1>

        <input type="text" placeholder="Tap RFID 1" style={styles.input} onChange={(e) => setRfid1(e.target.value)} />
        <input type="text" placeholder="Tap RFID 2" style={styles.input} onChange={(e) => setRfid2(e.target.value)} />

        <button onClick={handleDecrypt} disabled={loading} style={styles.button}>
          {loading ? "Decrypting..." : "Decrypt"}
        </button>

        {message && <p style={{ ...styles.message, color: message.includes("❌") ? "red" : "green" }}>{message}</p>}

        {/* Visualization */}
        {part1 && part2 && (
          <div style={styles.visualContainer}>
            <h3>🔐 Encrypted Parts:</h3>
            <div style={styles.row}>
              <div style={styles.box}>
                <strong>Part 1:</strong> {part1.substring(0, 50)}...
              </div>
              <div style={styles.box}>
                <strong>Part 2:</strong> {part2.substring(0, 50)}...
              </div>
            </div>

            <h3>🔗 Merged Encrypted Data:</h3>
            <div style={styles.dataBox}>{mergedEncryptedData.substring(0, 100)}...</div>

            <h3>🔓 Base64 Decoded Data:</h3>
            <div style={styles.dataBox}>{decryptedText.substring(0, 100)}...</div>
          </div>
        )}

        {decryptedFile && (
          <div>
            <h3>Decrypted File:</h3>
            <button onClick={handleDownload} style={styles.button}>Download File</button>
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

export default DecryptPage;
