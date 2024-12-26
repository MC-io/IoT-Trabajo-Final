import React, { useEffect, useRef } from "react";
import { useOpenCv } from "opencv-react";

const HeatmapFromImages = ({ imageUrls }) => {
  const { cv, loaded } = useOpenCv(); // Cargar OpenCV.js desde opencv-react
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!loaded || !cv) {
      console.warn("OpenCV aún no está listo o no se cargó correctamente.");
      return;
    }

    const processFrames = async () => {
      try {
        const frames = await Promise.allSettled(
          imageUrls.map(async (url) => {
            const img = await loadImage(url);
            const mat = cv.imread(img);
            if (!mat || mat.empty()) {
              throw new Error(`Error al convertir la imagen a cv.Mat: ${url}`);
            }
            return mat;
          })
        );

        const successfulFrames = frames
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        if (successfulFrames.length < 2) {
          console.warn("No hay suficientes imágenes procesadas para calcular diferencias.");
          return;
        }

        let frameDiffAccum = new cv.Mat.zeros(
          successfulFrames[0].rows,
          successfulFrames[0].cols,
          cv.CV_8UC1 // Escala de grises
        );

        for (let i = 1; i < successfulFrames.length; i++) {
          const prevFrame = successfulFrames[i - 1];
          const currFrame = successfulFrames[i];

          if (prevFrame.rows !== currFrame.rows || prevFrame.cols !== currFrame.cols) {
            console.error(
              `Dimensiones incompatibles entre frames: Frame ${i - 1} (${prevFrame.rows}x${prevFrame.cols}) y Frame ${i} (${currFrame.rows}x${currFrame.cols})`
            );
            continue;
          }

          const diff = new cv.Mat();
          cv.absdiff(prevFrame, currFrame, diff);

          if (diff.channels() > 1) {
            const grayDiff = new cv.Mat();
            cv.cvtColor(diff, grayDiff, cv.COLOR_BGR2GRAY);
            cv.add(frameDiffAccum, grayDiff, frameDiffAccum);
            grayDiff.delete();
          } else {
            cv.add(frameDiffAccum, diff, frameDiffAccum);
          }

          diff.delete();
        }

        console.log("Aplicando umbral...");
        const thresh = new cv.Mat();
        cv.threshold(frameDiffAccum, thresh, 50, 255, cv.THRESH_BINARY);

        console.log("Normalizando para generar mapa de calor...");
        const normalized = new cv.Mat();
        cv.normalize(thresh, normalized, 0, 255, cv.NORM_MINMAX);

        console.log("Generando el mapa de calor...");
        const heatmap = new cv.Mat(normalized.rows, normalized.cols, cv.CV_8UC3);
        for (let y = 0; y < normalized.rows; y++) {
          for (let x = 0; x < normalized.cols; x++) {
            const intensity = normalized.ucharAt(y, x);
            const pixel = heatmap.ucharPtr(y, x);
            pixel[0] = intensity;      // Azul
            pixel[1] = 255 - intensity; // Verde
            pixel[2] = 255;          // Rojo
          }
        }

        console.log("Mostrando resultado en el canvas...");
        cv.imshow(canvasRef.current, heatmap);

        frameDiffAccum.delete();
        thresh.delete();
        normalized.delete();
        heatmap.delete();
        successfulFrames.forEach((frame) => frame.delete());

        console.log("Procesamiento completado con éxito.");
      } catch (error) {
        console.error("Error durante el procesamiento de frames:", error);
      }
    };

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url;
      });
    };

    processFrames();
  }, [loaded, cv, imageUrls]);

  return (
    <div>
      <h1>Mapa de Calor de Rastros de Movimiento</h1>
      {!loaded && <p>Cargando OpenCV...</p>}
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default HeatmapFromImages;
