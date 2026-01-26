export const RESUME_GUIDELINES = {
MAX_FILE_SIZE: 5 * 1024 * 1024, 
VALID_EXTENSIONS: ['pdf', 'doc', 'docx'],
MAX_FILENAME_LENGTH: 50,
NO_SPACES: true,
CONTENT_RESTRICTIONS: {
NO_IMAGES: true,
NO_HYPERLINKS: true
}
};

export const LOCAL_STORAGE_KEYS = {
APPLIED_JOBS: 'appliedJobs',
SAVED_JOBS: 'savedJobs',
RESUME_UPLOAD: "resumeUpload"
};

export const SESSION_STORAGE_KEYS = {
  FILTERS: "sessionFilters",   
  SEARCH: "sessionSearch",     
  SORT: "sessionSort"          
};