import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]

  return {
    base: repositoryName ? `/${repositoryName}/` : '/',
    plugins: [react()],
  }
})
