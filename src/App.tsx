import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import ArtworkTable from "./components/ArtworkTable";

const App: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ArtworkTable />
      </div>
    </div>
  );
};

export default App;
