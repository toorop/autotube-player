import './index.css'

const embedTemplate = `<iframe  width="{{width}}" height="{{height}}"src="{{baseURL}}/embed.html" title="{{title}}" frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
</iframe>
`

const getIframe = () => {
    return window.document.querySelector('#iVideo')
}

const getMain = () => {
    return window.document.querySelector('main')
}

const getVideoContainer = () => {
    return getIframe().contentWindow.document.querySelector('.shaka-scrim-container')
}

const getPlayerContainer = () => {
    return getIframe().contentWindow.document.querySelector('#player-container')
}

const getBaseUrl = () => {
    return window.location.origin
}


function handleIframeLoaded() {
    getPlayerContainer().setAttribute('style', 'max-height:700px;')
    resizeIframe()
}

const resizeIframe = () => {
    const videoContainerHeight = getVideoContainer().clientHeight
    getIframe().style.height = `${videoContainerHeight}px`
}

const hydrateHtml = () => {
    const title = window.document.querySelector('title').innerText
    const width = getIframe().clientWidth.toString()
    const height = getIframe().clientHeight.toString()
    let embed = embedTemplate.replaceAll('{{baseURL}}', getBaseUrl())
    embed = embed.replaceAll('{{title}}', title)
    embed = embed.replaceAll('{{width}}', width)
    embed = embed.replaceAll('{{height}}', height)

    const dashLink = getBaseUrl() + '/dash.mpd'

    window.document.querySelector('#embed-code').innerHTML = embed.replaceAll('<', '&lt').replaceAll('>', '&gt')
    window.document.querySelector('#dash-link').innerHTML = dashLink

}

const handleMessage = (event) => {
    if (event.data === 'att-video-loaded') {
        resizeIframe()
        getMain().classList.remove('opacity-0')
    }
}

// main
window.onresize = resizeIframe
window.addEventListener('message', handleMessage)
window.addEventListener('load', () => {
    setTimeout(() => {
        resizeIframe()
    }, 1000)
})

//dark mode
const selectElement = window.document.querySelector('#toggle-dark-mode')
selectElement.addEventListener('change', (evt) => {
    const result = document.querySelector('html')
    if (evt.target.checked) {
        result.classList.add('dark')
    } else {
        result.classList.remove('dark')
    }
})

// hydrate html
hydrateHtml()

// export (kind of)
window.handleIframeLoaded = handleIframeLoaded



