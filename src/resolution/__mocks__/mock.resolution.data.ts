export const mockUpdateMetadataDto = {
  videoUrl: 'http://example.com/videoUrl',
  metadata: {
    videoCode: 'VID12345',
    duration: 10,
    thumbnail: 'thumbnail',
  },
};

export const mockResolutionResponse = {
  success: true,
  message: 'Resolution updated successfully',
};

export const mockResolution = {
  id: 1,
  videoUrl: 'http://example.com/videoUrl',
  video: {
    id: 1,
    videoCode: 'VID12345',
    duration: 10,
    thumbnail: 'thumbnail',
  },
};

export const mockVideo = {
  id: 1,
  videoCode: 'VID12345',
  duration: 10,
  thumbnail: 'thumbnail',
  resolution: mockResolution,
};
