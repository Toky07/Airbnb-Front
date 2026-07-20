export interface HttpClient {
  get(url: string): Promise<Response>;
  post(url: string, body: unknown): Promise<Response>;
  put(url: string, body: unknown): Promise<Response>;
  patch(url: string, body: unknown): Promise<Response>;
  delete(url: string): Promise<Response>;
  postFormData(url: string, body: FormData): Promise<Response>;
  putFormData(url: string, body: FormData): Promise<Response>;
}
