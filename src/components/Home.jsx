import React, { useState, useEffect, useRef } from 'react';

export default function TikTokClone() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  // Vidéos de démonstration avec liens TikTok réels
  const tiktokVideos = [
    {
      id: 1,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      tiktokUrl: "https://www.tiktok.com/@dudufaitdesvideos/video/7524394926528843013?q=dudu&t=1758128159144",
      creator: {
        username: "dudufaitdesvideos",
        name: "Dudu",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
      },
      description: "Quand tu penses avoir tout vu mais non 😂 #dudu #funny #viral",
      likes: "2.4M",
      comments: "34.2K",
      shares: "128.5K",
      song: "Son original - dudufaitdesvideos"
    },
    {
      id: 2,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      tiktokUrl: "https://www.tiktok.com/@creativeuser/video/1234567890",
      creator: {
        username: "creativeuser",
        name: "Creative User",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      description: "Animation incroyable ! 🎨✨ #art #animation #creative",
      likes: "1.8M",
      comments: "22.1K",
      shares: "87.3K",
      song: "Musique tendance - Creative User"
    }
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % tiktokVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + tiktokVideos.length) % tiktokVideos.length);
  };

  const openTikTokVideo = () => {
    const url = tiktokVideos[currentVideo].tiktokUrl;
    // Détection mobile pour ouvrir l'app TikTok ou le navigateur
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|iPhone|iPad|iPod|blackberry|iemobile|opera mini/i.test(userAgent);

    if (isMobile) {
      // Essaie d'ouvrir l'app TikTok, sinon ouvre dans le navigateur
      const tiktokAppUrl = url.replace('https://www.tiktok.com', 'snssdk1128://aweme/detail');
      window.location.href = tiktokAppUrl;

      // Fallback vers le navigateur après 2 secondes si l'app ne s'ouvre pas
      setTimeout(() => {
        window.open(url, '_blank');
      }, 2000);
    } else {
      // Sur desktop, ouvre dans un nouvel onglet
      window.open(url, '_blank');
    }
  };

  // Gestion des touches pour navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') prevVideo();
      if (e.key === 'ArrowDown') nextVideo();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-play quand la vidéo change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Gestion des erreurs d'autoplay
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [currentVideo]);

  return (
    <div style={{
      height: '100vh',
      background: '#000',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header TikTok */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ width: '30px' }}></div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '8px 0',
            cursor: 'pointer',
            borderBottom: '2px solid #fff'
          }}>
            Pour toi
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#ccc',
            fontSize: '16px',
            padding: '8px 0',
            cursor: 'pointer'
          }}>
            Abonnements
          </button>
        </div>

        <button style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          padding: '5px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </button>
      </header>

      {/* Zone de vidéo */}
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000',
        position: 'relative'
      }}>
        {/* Boutons de navigation invisibles */}
        <button
          onClick={prevVideo}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '50%',
            height: '60%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 50
          }}
          aria-label="Vidéo précédente"
        />

        <button
          onClick={nextVideo}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '50%',
            height: '60%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 50
          }}
          aria-label="Vidéo suivante"
        />

        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '375px',
          height: '100%',
          overflow: 'hidden'
        }}>
          <video
            ref={videoRef}
            src={tiktokVideos[currentVideo].videoUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            loop
            muted
            playsInline
            onClick={togglePlay}
          />

          {/* Bouton pour ouvrir la vraie vidéo TikTok */}
          <button
            onClick={openTikTokVideo}
            style={{
              position: 'absolute',
              top: '80px',
              right: '20px',
              background: 'rgba(0,0,0,0.7)',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 15px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              zIndex: 20,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm6 16H8a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h2v1a1 1 0 0 0 2 0V9h2v12a1 1 0 0 1-1 1z"/>
            </svg>
            Voir sur TikTok
          </button>

          {/* Indicateur de pause */}
          {!isPlaying && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              padding: '20px',
              zIndex: 10
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}

          {/* Sidebar droite */}
          <div style={{
            position: 'absolute',
            right: '15px',
            bottom: '120px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            zIndex: 10
          }}>
            {/* Avatar créateur */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff0050, #ff0050)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                cursor: 'pointer'
              }}>
                <img
                  src={tiktokVideos[currentVideo].creator.avatar}
                  alt={tiktokVideos[currentVideo].creator.username}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ff0050',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                +
              </div>
            </div>

            {/* Bouton Like */}
            <div style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '5px',
                transition: 'all 0.3s ease'
              }}>
                <svg width="28" height="28" viewBox="0 0 48 48" fill="#fff">
                  <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 8.1 7.2 11.6 10.2 4.4-3.9 8.1-7.2 11.6-10.2l2.3-2c.6-.6 1.3-1.2 1.9-1.7 5.2-4.5 10.6-9.1 10.6-16.5C48 9.6 42 3.1 34.6 3.1z"/>
                </svg>
              </div>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                {tiktokVideos[currentVideo].likes}
              </span>
            </div>

            {/* Bouton Commentaire */}
            <div style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '5px'
              }}>
                <svg width="28" height="28" viewBox="0 0 48 48" fill="#fff">
                  <path d="M47.5 46.1l-2.8-11.9c-1.8-7.8-8.2-13.3-16.1-13.3H19.4c-7.9 0-14.3 5.5-16.1 13.3L.5 46.1c-.4 1.7.3 3.4 1.7 4.3.8.5 1.8.8 2.8.8.9 0 1.7-.2 2.4-.7L16 43.6h16l8.6 6.9c.7.5 1.5.7 2.4.7 1 0 2-.3 2.8-.8 1.4-.9 2.1-2.6 1.7-4.3z"/>
                </svg>
              </div>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                {tiktokVideos[currentVideo].comments}
              </span>
            </div>

            {/* Bouton Partage */}
            <div style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '5px'
              }}>
                <svg width="28" height="28" viewBox="0 0 48 48" fill="#fff">
                  <path d="M42 18L24 36 6 18h12V6h12v12z"/>
                </svg>
              </div>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                {tiktokVideos[currentVideo].shares}
              </span>
            </div>

            {/* Album tournant */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: `url(${tiktokVideos[currentVideo].creator.avatar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                animation: isPlaying ? 'spin 3s linear infinite' : 'none',
                border: '2px solid #fff'
              }}>
              </div>
            </div>
          </div>

          {/* Informations vidéo */}
          <div style={{
            position: 'absolute',
            left: '15px',
            bottom: '120px',
            right: '80px',
            color: '#fff',
            zIndex: 10
          }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                @{tiktokVideos[currentVideo].creator.username}
              </span>
            </div>

            <div style={{ marginBottom: '15px', fontSize: '14px', lineHeight: '1.4' }}>
              {tiktokVideos[currentVideo].description}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              background: 'rgba(0,0,0,0.3)',
              padding: '5px 10px',
              borderRadius: '15px',
              width: 'fit-content'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a6 6 0 0 1 6 6c0 2.7-1.7 5.1-4.2 5.9-.5.2-1-.2-1-.7V11c0-.6-.4-1-1-1H6c-.6 0-1 .4-1 1v2.2c0 .5-.5.9-1 .7A6 6 0 0 1 8 2z"/>
              </svg>
              <span>{tiktokVideos[currentVideo].song}</span>
            </div>

            {/* Bouton alternatif en bas pour mobile */}
            <button
              onClick={openTikTokVideo}
              style={{
                background: 'linear-gradient(135deg, #ff0050, #ff6b6b)',
                border: 'none',
                borderRadius: '25px',
                padding: '8px 16px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 4px 15px rgba(255,0,80,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.153 2.819C9.725 2 10.818 2 12 2s2.275 0 2.847.819l.005.007c.57.818 1.663.818 2.233 0l.006-.007C17.657 2 18.75 2 19.922 2c1.172 0 2.265 0 2.831.819.566.818-.002 1.877-.57 2.695l-.005.007c-.57.818-.57 2.044 0 2.862l.005.007c.568.818 1.136 1.877.57 2.695C22.187 12 21.094 12 19.922 12h-.773c-.57 0-1.139.41-1.139 1s.568 1 1.139 1h.773c1.172 0 2.265 0 2.831.819.566.818-.002 1.877-.57 2.695l-.005.007c-.57.818-1.663.818-2.233 0l-.006-.007c-.57-.818-1.66-.818-2.23 0l-.006.007c-.57.818-1.663.818-2.233 0l-.005-.007c-.57-.818-1.66-.818-2.23 0l-.006.007c-.57.818-1.663.818-2.233 0l-.005-.007C7.843 16.695 7.275 15.636 7.84 14.818c.567-.818 1.636-1.877.57-2.695l-.005-.007c-.568-.818-1.136-1.877-.57-2.695.566-.819 1.659-.819 2.831-.819h.773c.57 0 1.139-.41 1.139-1s-.568-1-1.139-1h-.773c-1.172 0-2.265 0-2.831-.819-.566-.818.002-1.877.57-2.695l.005-.007c.57-.818 1.663-.818 2.233 0l.006.007c.57.818 1.66.818 2.23 0z"/>
              </svg>
              Ouvrir TikTok
            </button>
          </div>

          {/* Indicateurs de vidéo */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 5
          }}>
            {tiktokVideos.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '6px',
                  height: index === currentVideo ? '20px' : '6px',
                  borderRadius: '3px',
                  background: index === currentVideo ? '#fff' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Navigation bottom */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '80px',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 10
          }}>
            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </button>

            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
              </svg>
            </button>

            <button style={{
              width: '50px',
              height: '50px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #ff0050, #00f2ea)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>

            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </button>

            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}