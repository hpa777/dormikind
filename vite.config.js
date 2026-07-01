import { defineConfig } from 'vite'
import vituum from 'vituum'
import nunjucks from '@vituum/vite-plugin-nunjucks'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig(({ command }) => {
    return {
        plugins: [
            vituum(),
            nunjucks({
                root: './src',
                globals: {
                    pageClass: command === 'build' ? 'page' : 'page-dev',
                },
            }),
            tailwindcss(),
            /*
        ViteImageOptimizer({
            // Настройки для конвертации в webp
            webp: {
                quality: 100, // Качество (0-100)
            },
            // Можно также настроить другие форматы
            jpg: { quality: 100 },
            png: { quality: 100 },
        }),
        */
        ],
        build: {
            manifest: true,
            rollupOptions: {
                output: {
                    // Настройка для JS-файлов
                    entryFileNames: 'assets/[name].js',
                    // Настройка для разделяемых (chunk) JS-файлов
                    chunkFileNames: 'assets/[name].js',
                    // Настройка для статических ресурсов (CSS, изображения и т.д.)
                    assetFileNames: 'assets/[name].[ext]',
                },
            },
        },
    }
})
