export async function bootstrap (path: string): Promise<void> {
  await import(path)
}
