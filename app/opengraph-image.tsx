import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "Anova Motorsport";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let knyLogoBase64 = "";
  try {
    const knyLogo = readFileSync(
      join(process.cwd(), "public/logo-kny-sponsor.png")
    );
    knyLogoBase64 = `data:image/png;base64,${knyLogo.toString("base64")}`;
  } catch (e) {
    console.error("Failed to load local logo for OG image", e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#080808",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1613246273006-7f7476e693d9?q=80&w=1200&auto=format&fit=crop" 
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} 
        />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, marginTop: "-40px" }}>
          <h1
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "white",
              textTransform: "uppercase",
              fontStyle: "italic",
              margin: 0,
              padding: 0,
              letterSpacing: "2px",
              display: "flex",
            }}
          >
            ANOVA <span style={{ color: "#D32F2F", marginLeft: "20px" }}>MOTORSPORT</span>
          </h1>
          <p style={{ fontSize: 32, color: "#e4e4e7", marginTop: "20px" }}>
            Garis Finish Adalah Awal Perjuangan
          </p>
        </div>

        {/* Sponsors Bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
            width: "100%",
            backgroundColor: "white",
            padding: "30px",
            borderTop: "8px solid #D32F2F"
          }}
        >
          {knyLogoBase64 && <img src={knyLogoBase64} style={{ height: "45px", objectFit: "contain" }} />}
          <img src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T135844.401.jpg" style={{ height: "45px", objectFit: "contain" }} />
          <img src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140333.818.jpg" style={{ height: "45px", objectFit: "contain" }} />
          <img src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140310.536.jpg" style={{ height: "45px", objectFit: "contain" }} />
          <img src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140050.224.jpg" style={{ height: "45px", objectFit: "contain" }} />
          <img src="https://sumateracupprix.com/wp-content/uploads/2024/05/image-2024-05-31T140239.381.jpg" style={{ height: "45px", objectFit: "contain" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
