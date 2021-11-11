const log = document.getElementById('log')

const logger = {
    clear: () => {
        log.innerHTML = ''
    },
    debug: (...m) => {
        log.innerHTML += m.join(' ')
        log.innerHTML += '\n'
    },
}

export default logger
