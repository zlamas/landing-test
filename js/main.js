document.querySelector('.equipment__show')
    .addEventListener('click', (event) => {
        document.querySelectorAll('.equipment .mobile_hidden')
            .forEach((el) => {
                el.classList.remove('mobile_hidden');
            });
        event.target.remove();
    });

let popup_action = document.querySelector('.popup__action');
let popup_success = document.querySelector('.popup__success');

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup-open')) {
        popup_action.showModal();
    } else if (event.target.classList.contains('popup-close')) {
        event.target.closest('.popup').close();
    }
});

document.querySelector('.popup__action')
    .addEventListener('submit', (event) => {
        event.preventDefault();
        popup_action.close();
        popup_success.showModal();
    });

/*** telephone mask ***/

document.querySelector('input[type=tel]')
    .addEventListener('input', (event) => {
        event.target.value = event.target.value
            .replace(/(\+7|\D)/g, '')
            .replace(/(\d{0,10})\d*/, '+7 ($1')
            .replace(/(\d{3})(\d)/, '$1) $2')
            .replace(/(\d{3})(\d)/, '$1-$2')
            .replace(/(-\d{2})(\d)/, '$1-$2');
        });

/*** countdown clock ***/

let countdown = document.querySelector('.countdown__clock');
let timeRemaining = 1 * 60 * 60;
let countdown_interval = setInterval(updateTime, 1000);

function updateTime() {
    let hours = Math.floor(timeRemaining / (60 * 60));
    let minutes = Math.floor(timeRemaining / 60 - hours * 60);
    let seconds = timeRemaining % 60;

    let digits = [
        Math.floor(hours / 10),
        Math.floor(hours % 10),
        Math.floor(minutes / 10),
        Math.floor(minutes % 10),
        Math.floor(seconds / 10),
        Math.floor(seconds % 10),
    ];

    countdown.querySelectorAll('.countdown__digit')
        .forEach((digit, i) => {
            digit.textContent = digits[i];
        });

    timeRemaining--;

    if (timeRemaining < 0) {
        clearInterval(countdown_interval);
    }
}

updateTime();

/*** slider ***/

let slider = document.querySelector('.slider');
let slider_controls = document.querySelector('.slider__controls');
let slider_left = slider_controls.querySelector('.button_left');
let slider_right = slider_controls.querySelector('.button_right');
let slider_dots_wrapper = slider_controls.querySelector('.slider__dots');
let slider_dots = [];
let slides = slider.querySelectorAll('.slide');

let current_slide;
let total_slides;

function initSlider() {
    let slide_width = parseFloat(slider.dataset.minWidth);
    let slide_gap = parseFloat(getComputedStyle(slider).gap);
    let visible_slides = Math.floor(slider.offsetWidth / slide_width);

    slide_width += (slider.offsetWidth - slide_width * visible_slides - slide_gap * (visible_slides - 1)) / visible_slides;

    slider.style.setProperty('--slide-width', `${slide_width}px`);

    slider.scrollLeft = 0;
    slider_left.disabled = true;

    current_slide = 0;
    total_slides = slides.length - visible_slides + 1;

    while (slider_dots[0]) slider_dots[0].remove();

    slider_dots_wrapper.innerHTML =
        '<div class="slider__dot"></div>'.repeat(total_slides);

    slider_dots = slider_dots_wrapper
        .getElementsByClassName('slider__dot');

    slider_dots[0].classList.add('slider__dot_active');
}

function updateSlider() {
    slider_dots_wrapper.querySelector('.slider__dot_active')
        .classList.remove('slider__dot_active');

    slider_dots[current_slide]
        .classList.add('slider__dot_active');

    slides[current_slide].scrollIntoView({ block: 'nearest' });

    slider_left.disabled = (current_slide == 0);
    slider_right.disabled = (current_slide == total_slides - 1);
}

slider_left.addEventListener('click', () => {
    if (current_slide == 0) return;
    current_slide--;
    updateSlider();
});

slider_right.addEventListener('click', () => {
    if (current_slide == total_slides - 1) return;
    current_slide++;
    updateSlider();
});

window.addEventListener('resize', initSlider);

initSlider();

/*** yandex map ***/

let my_map;
let my_placemark;

function initMap() {
    my_map = new ymaps.Map('map', {
        center: [0, 0],
        zoom: 16,
        controls: []
    });

    my_placemark = new ymaps.Placemark(my_map.getCenter(), {}, {
        iconLayout: 'default#image',
        iconImageHref: 'img/map-marker.svg',
        iconImageSize: [62, 62],
    });

    my_map.geoObjects.add(my_placemark);

    updateCoords(document.querySelector('.map__toggle:checked'));
}

function updateCoords(option) {
    let latitude = parseFloat(option.dataset.latitude);
    let longitude = parseFloat(option.dataset.longitude);

    my_map.setCenter([latitude, longitude]);
    my_placemark.geometry.setCoordinates([latitude, longitude]);
}

ymaps.ready(initMap);

document.querySelector('.map__select')
    .addEventListener('change', (event) => updateCoords(event.target));
