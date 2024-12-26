import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import VideoCard from "./components/VideoCard";
import VideoCardSimulation from "./components/VideoCardSimulation";
import HeatMapFromImages from "./components/HeatMapFromImages";

import "./App.css";


function App() {
  const [videoArray, setVideoArray] = useState([null, null, null]);
  const [searchQuery, setSearchQuery] = useState(""); // Nuevo estado para la búsqueda
  const [historyVideos, setHistoryVideos] = useState([]); // Videos del historial agrupados
  const [isSearchActive, setIsSearchActive] = useState(false); // Alternar entre Real-Time y Historial
  
  const imageUrls = [
    "/image-1.jpeg",
    "/image-2.jpeg",
    "/image-3.jpeg",
    "/image-4.jpeg",
    "/image-5.jpeg",
    "/image-6.jpeg",
    "/image-7.jpeg",
    "/image-8.jpeg",
    "/image-9.jpeg",
    "/image-10.jpeg",
  ];
  
  useEffect(() => {
    const ws = new WebSocket("ws://34.59.215.238");

    ws.onopen = () => {
      console.log("Conexión establecida");
    };

    ws.onmessage = (event) => {
      handleJsonSubmit(event.data);
    };

    ws.onerror = (error) => {
      console.error("Error");
    }
  }, []);


  const handleJsonSubmit = (message) => {
    try {
      const parsedJson = JSON.parse(message);
      const { name, url, metadata } = parsedJson;
      const index = parseInt(name.charAt(name.length - 1), 10) - 1;
      if (index !== -1) {
        setVideoArray((prevArray) => {
          const newArray = [...prevArray];
          newArray[index] = { url, metadata };
          return newArray;
        });
      }
    } catch (error) {
      alert("Invalid JSON input");
    }
  };

  const fetchHistory = async (query) => {
    try {
      const response = await fetch(`http://34.28.167.34/history/${query}`);
      const data = await response.json();
    //   const data = [{
    //     name: "video1",
    //     url: "https://storage.googleapis.com/camera-frames/frames/video1-1320.jpg",
    //     metadata:[
    //     {
    //         "bbox": {
    //             "x_max": 801.1069946289062,
    //             "x_min": 655.3439331054688,
    //             "y_max": 502.25506591796875,
    //             "y_min": 502.25506591796875
    //         },
    //         "confidence": 0.8680214881896973,
    //         "label": "car"
    //     },
    //     {
    //         "bbox": {
    //             "x_max": 211.6827392578125,
    //             "x_min": 105.0384292602539,
    //             "y_max": 354.09429931640625,
    //             "y_min": 354.09429931640625
    //         },
    //         "confidence": 0.8215506076812744,
    //         "label": "car"
    //     },
    //     {
    //         "bbox": {
    //             "x_max": 1009.142578125,
    //             "x_min": 946.477294921875,
    //             "y_max": 331.0118408203125,
    //             "y_min": 331.0118408203125
    //         },
    //         "confidence": 0.787013053894043,
    //         "label": "car"
    //     },
    //     {
    //         "bbox": {
    //             "x_max": 125.03730010986328,
    //             "x_min": 0.0,
    //             "y_max": 390.81915283203125,
    //             "y_min": 390.81915283203125
    //         },
    //         "confidence": 0.3903093636035919,
    //         "label": "truck"
    //     },
    //     {
    //         "bbox": {
    //             "x_max": 124.04657745361328,
    //             "x_min": 0.0,
    //             "y_max": 391.6747131347656,
    //             "y_min": 391.6747131347656
    //         },
    //         "confidence": 0.33328986167907715,
    //         "label": "bus"
    //     }
    // ],
    //     timestamp: "2022-01-01T12:00:00Z",
    //   },
    //   ]
      const groupedVideos = data.reduce((acc, video) => {
        const { name, url, metadata, timestamp } = video;
        if (!acc[name]) {
          acc[name] = { name, urls: [], metadata: [], timestamps: [] };
        }
        acc[name].urls.push(url);
        acc[name].metadata.push(metadata);
        acc[name].timestamps.push(timestamp);
        return acc;
      }, {});

      console.log(groupedVideos);

      setHistoryVideos(Object.values(groupedVideos));
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setIsSearchActive(true);
      fetchHistory(query); 
    } else {
      setIsSearchActive(false); 
    }
  };

  // Filtrar los videos según el término de búsqueda
  // const filteredVideos = videoArray.map((video) => {
  //   if (!video || !searchQuery) return video;

  //   const filteredDetections = video.detections.filter((detection) =>
  //     detection.label.toLowerCase().includes(searchQuery)
  //   );

  //   console.log(searchQuery)

  //   return filteredDetections.length > 0
  //     ? { ...video, detections: filteredDetections }
  //     : null;
  // });

  return (
    <div className="App">
      <h1 className="app-title">Sistema de Cámaras de Vigilancia</h1>
      <SearchBar onSearch={handleSearch} />

      {!isSearchActive ? (
        <div className="video-grid real-time">
          {videoArray.every((video) => video === null) ? (
            <p className="no-videos">No se encontraron resultados en tiempo real.</p>
          ) : (
            videoArray.map((video, index) =>
              video ? (
                <div
                  key={index}
                  className="video-item"
                >
                  <p className="camera-label">Cámara {index + 1}</p>
                  <VideoCard imageUrl={video.url} metadata={video.metadata} />
                </div>
              ) : null
            )
          )}
        </div>
      ) : (
        <div className="video-grid historial">
          {historyVideos.length === 0 ? (
            <p className="no-videos">No se encontraron resultados en el historial.c</p>
          ) : (
            historyVideos.map((video, index) => (
              <div
                key={index}
                className="video-item"
              >
                 <p className="camera-label">Cámara {index + 1}</p>
                <VideoCardSimulation
                  video={video}
                /> 
              </div> 
            
            ))
          )}
        </div>
      )}
      <HeatMapFromImages imageUrls={imageUrls} />
    </div>
    
  );
}

export default App;
