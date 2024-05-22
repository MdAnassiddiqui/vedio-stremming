document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('video');
    const youtubeElement = document.getElementById('youtube-video');
    const videoUrlInput = document.getElementById('video-url');
    const captionTextInput = document.getElementById('caption-text');
    const captionTimeInput = document.getElementById('caption-time');
    const addCaptionButton = document.getElementById('add-caption');
    const captionDisplay = document.getElementById('caption-display');
    
    const captions = [];

    function isYouTubeUrl(url) {
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
        return youtubeRegex.test(url);
    }

    function convertYouTubeUrl(url) {
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?v=)([^\s&]+)/);
        if (videoIdMatch) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        } else {
            console.error('Invalid YouTube URL');
            return null;
        }
    }

    function updateVideoSource(url) {
        if (isYouTubeUrl(url)) {
            const embeddableUrl = convertYouTubeUrl(url);
            if (embeddableUrl) {
                youtubeElement.src = embeddableUrl;
                youtubeElement.style.display = 'block';
                videoElement.style.display = 'none';
                videoElement.pause();
            } else {
                alert('Invalid YouTube URL. Please enter a valid URL.');
            }
        } else {
            youtubeElement.style.display = 'none';
            videoElement.style.display = 'block';
            videoElement.src = url;
            videoElement.load();
        }
    }

    videoUrlInput.addEventListener('change', () => {
        const videoUrl = videoUrlInput.value;
        updateVideoSource(videoUrl);
    });

    addCaptionButton.addEventListener('click', () => {
        const captionText = captionTextInput.value.trim(); 
        const captionTime = parseFloat(captionTimeInput.value);

        if (captionText === "") {
            alert('Please enter a valid caption text.');
            return; 
        }

        if (isNaN(captionTime) || captionTime < 0) {
            alert('Please enter a valid positive timestamp.');
            return;
        }

        const currentTime = videoElement.currentTime;
        const absoluteTime = currentTime + captionTime;
        captions.push({ text: captionText, time: absoluteTime });
        
        
        captionTextInput.value = '';
        captionTimeInput.value = '';

        console.log('Caption added:', captionText, 'at', absoluteTime);

        alert('Caption added!');
    });

    function displayCaptions(currentTime) {
        const currentCaption = captions.find(caption => 
            Math.abs(currentTime - caption.time) < 0.5 
        );
        
        if (currentCaption) {
            captionDisplay.innerText = currentCaption.text;
            captionDisplay.style.display = 'block';
        } else {
            captionDisplay.style.display = 'none';
        }

        console.log('Current time:', currentTime, 'Current caption:', currentCaption);
    }

    videoElement.addEventListener('timeupdate', () => {
        const currentTime = videoElement.currentTime;
        displayCaptions(currentTime);
    });

    let player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('youtube-video', {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            setInterval(() => {
                const currentTime = player.getCurrentTime();
                displayCaptions(currentTime);
            }, 1000);
        }
    }

  
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});
