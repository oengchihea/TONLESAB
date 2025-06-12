"use client"
import styles from "../../styles/landing/css-rotating-cube.module.css"

export default function CssRotatingCube() {
  const faceContent = (faceName, color) => (
    <div className={`${styles.cubeFace} ${styles[faceName]}`} style={{ backgroundColor: color || "#22a094" }}></div>
  )

  return (
    <div className={styles.scene}>
      <div className={styles.cube}>
        {faceContent("front", "#22a094")}
        {faceContent("back", "#1f8f85")}
        {faceContent("right", "#25b3a7")}
        {faceContent("left", "#1c7a71")}
        {faceContent("top", "#28c7b9")}
        {faceContent("bottom", "#1a6b62")}
      </div>
    </div>
  )
}
  