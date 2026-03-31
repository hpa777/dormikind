import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
    duration: 1.5, // Длительность прокрутки (в секундах)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Функция плавности
    smoothWheel: true, // Включение мягкой прокрутки колесом
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

document.addEventListener('DOMContentLoaded', (event) => {
    ScrollTrigger.batch('.fade-in', {
        onEnter: (batch) =>
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                delay: 0.5,
                duration: 1,
            }),
    })
})
