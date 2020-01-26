import React from "react";

const footerStyle = {
  backgroundColor: "white",
  fontSize: "20px",
  color: "white",
  textAlign: "center",
  padding: "6px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "50px",
  width: "100%"
};

const phantomStyle = {
  display: "block",
  padding: "20px",
  height: "50px",
  width: "100%"
};


export default function Footer({ children }) {
  return (
    <div>
      <div style={phantomStyle} />
      <div style={footerStyle}>{children}</div>
    </div>
  );
}