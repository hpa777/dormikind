import vituum from 'vituum'
import nunjucks from '@vituum/vite-plugin-nunjucks'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default {
    plugins: [
        vituum(),
        nunjucks({
            root: './src',
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
}
