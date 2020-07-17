// register service worker
if (navigator.serviceWorker) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('sw.js')
            // .then(reg => console.log('registered'))
            .catch(err => console.log(`${err}`));
    })
}

// pwa install banner vars
const installBanner = document.querySelector('#installBanner');
const buttonInstall = document.querySelector('#btnInstall');
const closeBanner = document.querySelector('#closeBanner');
const height = '-' + installBanner.offsetHeight + 'px';

// hide install banner if pwa is installed
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault;
    deferredPrompt = e;
    setTimeout(() => {
        if (sessionStorage.installBanner === 'none') {
            installBanner.style.marginTop = height;
            console.log(1);
        } else {
            installBanner.style.marginTop = '0px';
            console.log(2);
        }
    }, 3000);
});

// handle pwa install
buttonInstall.addEventListener('click', (e) => {
    installBanner.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
    });
});

// pwa installed alert
window.addEventListener('appinstalled', (e) => {
    console.log('INSTALL: Success');
});

// hide install banner 
closeBanner.addEventListener('click', () => {
    installBanner.style.marginTop = height;
    sessionStorage.setItem('installBanner', 'none');
});