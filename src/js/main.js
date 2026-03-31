import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import Lenis from 'lenis'
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import { Fancybox, Panzoom } from '@fancyapps/ui/dist/fancybox/'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
//import 'swiper/css/navigation'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

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
    const mm = gsap.matchMedia()
    mm.add(
        {
            isDesktop: '(min-width: 1024px)',
            isMobile: '(max-width: 767px)',
            isMobileLandscape: '(max-width: 932px) and (orientation: landscape)',
            isTablet: '(min-width: 768px) and (max-width: 1023px)',
            reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
            let { isDesktop, isMobile, isTablet, reduceMotion, isMobileLandscape } = context.conditions

            const starBullits = gsap.utils.toArray('.star-bullit')
            gsap.set(starBullits, { clearProps: 'left,top,transform' })
            starBullits.forEach((elem) => {
                gsap.to(elem, {
                    scrollTrigger: {
                        trigger: '.scrubMarker1',
                        start: 'top top',
                        end: elem.dataset.end || '+=500',
                        scrub: true,
                        //markers: true,
                    },
                    motionPath: {
                        path: [{ left: '0', top: '50%' }],
                        type: 'leftTop',
                        fromCurrent: true,
                    },
                    opacity: 1,
                    overwrite: 'auto',
                })
            })

            if (isDesktop || isMobileLandscape) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: '.scene-10',
                        start: 'top bottom',
                        end: 'bottom center',
                        scrub: true,
                    },
                })
                    .to('#boy-w-pack', {
                        position: 'absolute',
                        left: '50%',
                        xPercent: -50,
                        duration: 1,
                    })
                    .to({}, { duration: 2 })
                    .to('#boy-w-pack', {
                        opacity: 0,
                        duration: 0.5,
                    })
            } else {
                gsap.to('#boy-w-pack', {
                    scrollTrigger: {
                        trigger: '.scene-10',
                        start: 'bottom bottom',
                        end: 'bottom center',
                        scrub: true,
                    },
                    opacity: 0,
                })
            }
            gsap.fromTo(
                '.card',
                {
                    rotation: 30, // Starting angle
                },
                {
                    rotation: -30, // Ending angle
                    ease: 'power1.inOut', // Non-linear movement
                    stagger: isDesktop ? 0.11 : 0.2, // Delay between the start of each circle
                    scrollTrigger: {
                        trigger: '.scene-10', // Listening to pinHeight
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true, // Animation progresses with scrolling
                        // markers:true
                    },
                }
            )
            gsap.timeline({
                scrollTrigger: {
                    trigger: '.night-bg',
                    start: 'top top',
                    endTrigger: '#footer',
                    end: 'bottom bottom',
                    scrub: true,
                },
            })
                .to('#clouds-back', {
                    height: '26vh',
                    duration: 10,
                })
                .to({}, { duration: 100 })
                .to('#clouds-back', {
                    duration: 5,
                    height: isDesktop ? '42vh' : isMobileLandscape ? '80vh' : isTablet ? '38vh' : '70vh',
                })
        }
    )

    gsap.timeline({
        scrollTrigger: {
            trigger: '.scene-24',
            start: 'top top',
            end: 'bottom center',
            scrub: true,
        },
    })
        .to('.scene-24', {
            opacity: 1,
            duration: 1,
            force3D: true,
            immediateRender: false,
        })
        .to({}, { duration: 1.5 })
        .to('.scene-24', {
            opacity: 0.001,
            duration: 0.5,
        })
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

    gsap.utils.toArray('[data-move]').forEach((elem) => {
        const param = {
            x: elem.dataset.x || 0,
            y: elem.dataset.y || 0,
            rotate: elem.dataset.rotate || 0,
            scale: elem.dataset.scale || 1,
            opacity: elem.dataset.opacity || 0,
            //duration: elem.dataset.duration || '',
            delay: elem.dataset.delay || 0,
        }
        if (elem.dataset.duration) {
            param['duration'] = elem.dataset.duration
        }
        if (elem.dataset.trigger !== 'no') {
            param['scrollTrigger'] = {
                trigger: elem.dataset.trigger || elem,
                endTrigger: elem.dataset.endtrigger || '',
                start: elem.dataset.start || 'top bottom',
                end: elem.dataset.end || 'bottom -30%',
                scrub: !(elem.dataset.scrub === 'no'),
                //markers: true,
            }
        }

        if (elem.dataset.path) {
            param['motionPath'] = {
                path: JSON.parse(elem.dataset.path),
                type: 'leftBottom',
            }
        }

        if (elem.dataset.move === 'to') {
            gsap.to(elem, param)
        } else {
            gsap.from(elem, param)
        }
    })

    if (!window.matchMedia('(pointer: coarse)').matches) {
        const scrollZoomElements = document.querySelectorAll('[scroll-zoom]')
        scrollZoom(scrollZoomElements)
    }

    const animCanvas1 = document.getElementById('my-canvas')
    if (animCanvas1) {
        getFrames('/images/dorm_webp_frames/dormikind_pack_', 325, 2).then((frames) => {
            setCanvas(
                animCanvas1,
                frames,
                {
                    trigger: '.scene-1',
                    start: 'top top',
                    end: '300%',
                    scrub: true,
                    //markers: true,
                },
                (el) => {
                    const offset = {
                        offsetX: 0,
                        offsetY: 0,
                    }
                    //debugger
                    if (window.innerWidth <= 932 && window.innerHeight < window.innerWidth) {
                        offset.offsetX = Math.round(window.innerWidth / 10)
                        offset.offsetY = Math.round(window.innerHeight / 5)
                        //console.log('landscape')
                    } else if (window.innerWidth < 376) {
                        offset.offsetX = 60
                        offset.offsetY = 30
                    } else if (window.innerWidth < 768) {
                        offset.offsetX = 150
                        offset.offsetY = 80
                    } else if (window.innerWidth < 1024) {
                        offset.offsetX = Math.round(window.innerWidth / 1.8)
                        offset.offsetY = Math.round(window.innerHeight / 5)
                        //console.log('tablet')
                    }
                    //console.log(offset)
                    return offset
                }
            )
        })
    }

    const animCanvas2 = document.getElementById('boy-w-pack')
    const animCanvas3 = document.getElementById('boy-w-pack-foot')
    if (animCanvas2 && animCanvas3) {
        getFrames('/images/boy_webp_frames/dormikind_boy_', 149, 4).then((frames) => {
            setCanvas(animCanvas2, frames, {
                trigger: '.scene-8',
                start: 'bottom center',
                end: '300%',
                scrub: true,
            })
            setCanvas(animCanvas3, frames, {
                trigger: '.scene-24',
                start: 'top -50%',
                end: '80%',
                scrub: true,
            })
        })
    }

    document.querySelectorAll('.swiper-slide').forEach((elem) => {
        elem.addEventListener('click', function () {
            Fancybox.show(
                [
                    {
                        html: this.innerHTML, // Используем src
                        type: 'html', // Явно указываем тип контента
                    },
                ],
                {
                    // Главное для отключения "ладони" и включения скролла:
                    dragToClose: false,

                    // Отключаем Panzoom полностью
                    Panzoom: {
                        enabled: false,
                    },

                    // Настройки для HTML контента
                    Html: {
                        autoFocus: true,
                        scrollLock: true,
                    },

                    // Убираем клики-зумы, которые могут мешать
                    contentClick: null,
                    on: {
                        'Carousel.ready Carousel.change': () => {
                            //debugger
                            const slide = Fancybox.getSlide()
                            const target = slide.el.querySelector('.swiper-slide__text')
                            target.addEventListener(
                                'wheel',
                                function (e) {
                                    // Проверяем, есть ли вообще скролл в блоке
                                    const isScrollable = target.scrollHeight > target.clientHeight

                                    if (isScrollable) {
                                        // Останавливаем всплытие к Fancybox, чтобы он не блокировал событие
                                        e.stopPropagation()

                                        // Прокручиваем вручную
                                        // e.deltaY — это направление и скорость прокрутки (вверх/вниз)
                                        target.scrollTop += e.deltaY

                                        // Если нужно, чтобы страница под попапом не дергалась:
                                        if (e.cancelable) e.preventDefault()
                                    }
                                },
                                { passive: false }
                            )
                        },
                    },
                }
            )
        })
    })
})

async function scrollZoom(scrollZoomElements) {
    let animationFrameId = null
    let lastX = 0,
        lastY = 0
    const sensitivity = 2 // Minimum movement threshold

    const handleMouseMove = (event) => {
        if (animationFrameId) return

        animationFrameId = requestAnimationFrame(() => {
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2
            const distanceX = event.clientX - centerX
            const distanceY = event.clientY - centerY

            // Only animate if movement exceeds sensitivity threshold
            if (Math.abs(distanceX - lastX) < sensitivity && Math.abs(distanceY - lastY) < sensitivity) {
                animationFrameId = null
                return
            }

            lastX = distanceX
            lastY = distanceY

            scrollZoomElements.forEach((el) => {
                const depth = parseFloat(el.getAttribute('scroll-zoom')) || 1
                gsap.to(el, {
                    x: (distanceX / centerX) * -20 * depth,
                    y: (distanceY / centerY) * -30 * depth,
                    ease: 'power2.out',
                    duration: 4,
                })
            })

            animationFrameId = null
        })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
}

function resizeCanvasToDisplaySize(canvas) {
    // Берем DPR устройства, но не больше 2
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Рассчитываем физические пиксели
    const width = Math.floor(canvas.clientWidth * dpr)
    const height = Math.floor(canvas.clientHeight * dpr)

    // Если размеры в пикселях изменились — обновляем холст
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        return true
    }
    return false
}

function render(canvas, img, offsetFunction) {
    //resizeCanvasToDisplaySize(canvas)
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    let offsetX = 0,
        offsetY = 0
    if (offsetFunction) {
        ;({ offsetX, offsetY } = offsetFunction(canvas))
    }
    context.drawImage(img, offsetX, offsetY, canvas.width, canvas.height)
}

async function setCanvas(canvas, images, scrollTrigger, offsetFunction) {
    const counter = { frame: 0 }
    let prevIdx = -1
    const setImg = () => {
        if (counter.frame !== prevIdx && images[counter.frame] !== undefined) {
            render(canvas, images[counter.frame], offsetFunction)
            prevIdx = counter.frame
        }
    }

    gsap.to(counter, {
        frame: images.length - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: scrollTrigger,
        onUpdate: setImg,
    })
    window.addEventListener('resize', () => {
        resizeCanvasToDisplaySize(canvas)
        prevIdx = -1
        setImg()
    })
    resizeCanvasToDisplaySize(canvas)
    setImg()
    //render(canvas, images[0], offsetFunction)
    gsap.to(canvas, {
        opacity: 1,
        duration: 1,
        delay: 0.4,
        ease: 'none',
    })
}

async function getFrames(basePath, frameCount, skipEach) {
    const promises = []
    let c = 1

    for (let i = 0; i < frameCount; i++) {
        if (skipEach !== undefined && skipEach === c) {
            c = 1
            continue
        }
        const img = new Image()
        const promise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img)
            img.onerror = () => reject(new Error(`Ошибка загрузки: ${img.src}`))
            img.src = `${basePath}${i.toString().padStart(4, '0')}.webp`
        })

        promises.push(promise)
        c++
    }

    return Promise.all(promises)
}

const swiper = new Swiper('.swiper', {
    modules: [Navigation],
    loop: true,
    slidesPerView: 1,

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    speed: 800,

    // Настройка плавности через CSS-transition
    /*
    freeMode: {
        enabled: true,
        sticky: true, // чтобы слайды «примагничивались» к позициям
        momentumRatio: 0.5,
    },
    */

    // Использование кастомной кривой плавности
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    breakpoints: {
        667: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 30,
        },
    },
})
