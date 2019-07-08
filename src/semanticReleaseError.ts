class SemanticReleaseError extends Error {
  public code?: string;
  public details?: string;
  public semanticRelease?: boolean;
  constructor(message?: string, code?: string, details?: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "SemanticReleaseError";
    this.code = code;
    this.details = details;
    this.semanticRelease = true;
  }
}

export default SemanticReleaseError;
