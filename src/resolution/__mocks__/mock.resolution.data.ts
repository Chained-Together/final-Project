export const mockUpdateMetadataDto = {
    highResolutionUrl: 'http://example.com/high-resolution',
    lowResolutionUrl: 'http://example.com/low-resolution',
    metadata: {
      videoCode: 'VID12345',
      duration: 10,
    },
  };
  
  export const mockResolutionResponse = {
    success: true,
    message: 'Resolution updated successfully',
  };
  
  export const mockResolution = {
    id: 1,
    high: 'http://example.com/high-resolution',
    low: 'http://example.com/low-resolution',
    video: {
      id: 1,
      videoCode: 'VID12345',
      duration: 10,
    },
  };
  
  export const mockVideo = {
    id: 1,
    videoCode: 'VID12345',
    duration: 10,
    resolution: mockResolution,
  };
  