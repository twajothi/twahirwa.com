const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ARTIST_ID = process.env.ARTIST_ID || '1zMYW2mNBr1VFO6iuOh7F9';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyAccessToken() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}

async function getArtistAlbums(accessToken) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: {
          include_groups: 'album,single',
          market: 'US',
          limit: 50,
          offset: 0
        }
      }
    );
    return response.data.items;
  } catch (error) {
    console.error('Error getting artist albums:', error.response?.data || error.message);
    throw error;
  }
}

async function getAlbumTracks(accessToken, albumId) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: {
          market: 'US'
        }
      }
    );
    return response.data.items;
  } catch (error) {
    console.error('Error getting album tracks:', error.response?.data || error.message);
    throw error;
  }
}

async function getArtistInfo(accessToken) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting artist info:', error.response?.data || error.message);
    throw error;
  }
}

function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function updateMusicData() {
  try {
    console.log('🎵 Starting Spotify API update...');
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Missing Spotify API credentials');
    }

    const accessToken = await getSpotifyAccessToken();
    console.log('✅ Got Spotify access token');
    
    const [artistInfo, albums] = await Promise.all([
      getArtistInfo(accessToken),
      getArtistAlbums(accessToken)
    ]);
    
    console.log(`✅ Found ${albums.length} releases for ${artistInfo.name}`);
    
    const featuredTracks = [];
    
    // Process albums to get tracks
    for (const album of albums.slice(0, 10)) { // Limit to recent 10 releases
      try {
        const tracks = await getAlbumTracks(accessToken, album.id);
        
        for (const track of tracks) {
          featuredTracks.push({
            id: `${track.id}`,
            title: track.name,
            album: album.name,
            duration: formatDuration(track.duration_ms),
            spotifyUrl: track.external_urls.spotify,
            previewUrl: track.preview_url,
            releaseDate: album.release_date,
            description: `From "${album.name}" (${album.release_date.split('-')[0]})`
          });
        }
      } catch (trackError) {
        console.warn(`Warning: Could not get tracks for album ${album.name}:`, trackError.message);
      }
    }
    
    // Sort by release date (newest first) and take top tracks
    featuredTracks.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    
    // Load existing music.json to preserve other data
    const musicJsonPath = path.join(process.cwd(), 'assets/data/music.json');
    let existingMusic = {};
    
    try {
      if (fs.existsSync(musicJsonPath)) {
        existingMusic = JSON.parse(fs.readFileSync(musicJsonPath, 'utf8'));
      }
    } catch (parseError) {
      console.warn('Warning: Could not parse existing music.json, creating new one');
    }
    
    // Create updated music data
    const updatedMusicData = {
      ...existingMusic,
      artistName: artistInfo.name,
      lastUpdated: new Date().toISOString(),
      featuredTracks: featuredTracks.slice(0, 6), // Keep top 6 tracks
      platforms: {
        ...existingMusic.platforms,
        spotify: artistInfo.external_urls.spotify
      },
      genres: artistInfo.genres.length > 0 ? artistInfo.genres : existingMusic.genres,
      followers: artistInfo.followers.total,
      popularity: artistInfo.popularity
    };
    
    // Write updated data
    fs.writeFileSync(musicJsonPath, JSON.stringify(updatedMusicData, null, 2));
    
    console.log('✅ Music data updated successfully!');
    console.log(`📊 Artist: ${artistInfo.name}`);
    console.log(`🎵 Tracks updated: ${featuredTracks.length}`);
    console.log(`👥 Followers: ${artistInfo.followers.total.toLocaleString()}`);
    console.log(`⭐ Popularity: ${artistInfo.popularity}/100`);
    
  } catch (error) {
    console.error('❌ Error updating music data:', error.message);
    
    // If this is a credentials error, exit with error code
    if (error.message.includes('credentials') || error.response?.status === 401) {
      console.error('Please check your Spotify API credentials in GitHub secrets');
      process.exit(1);
    }
    
    // For other errors, warn but don't fail the workflow
    console.warn('Continuing with existing music data...');
    process.exit(0);
  }
}

// Only run if called directly (not imported)
if (require.main === module) {
  updateMusicData();
}

module.exports = { updateMusicData }; 