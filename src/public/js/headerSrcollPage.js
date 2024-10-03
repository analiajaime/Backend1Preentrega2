let isHeaderActive = false

const handleThemes = () => {
    const lightModeBtn = document.getElementById('themeChanger_light')
    const darkModeBtn = document.getElementById('themeChanger_dark')
    const autoModeBtn = document.getElementById('themeChanger_auto')

    const currentTheme = localStorage.getItem('theme') || 'auto'
    setTheme(currentTheme)

    lightModeBtn.addEventListener('click', () => setTheme('light'))
    darkModeBtn.addEventListener('click', () => setTheme('dark'))
    autoModeBtn.addEventListener('click', () => setTheme('auto'))

    function setTheme(theme) {
        localStorage.setItem('theme', theme)

        if (theme === 'auto') {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
            document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light')
            autoModeBtn.classList.add('selected')
            lightModeBtn.classList.remove('selected')
            darkModeBtn.classList.remove('selected')
        } else {
            document.documentElement.setAttribute('data-theme', theme)
            autoModeBtn.classList.remove('selected')
            lightModeBtn.classList.toggle('selected', theme === 'light')
            darkModeBtn.classList.toggle('selected', theme === 'dark')
        }
    }
}

handleThemes()

const animatedDiv = document.getElementById("headerPage_container")
const threshold = 380
const pageTitle = document.title
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY

    if (scrollY >= threshold) {
        document.getElementById("headerPage_container").innerHTML = `
            <div class="headerPage">
                <h3 class="headerPage_title">${pageTitle}</h3>
                <div class="headerPage_buttons">
                    <a href="#header_global"><button class="goUp_btn" type="button" id="headerPage_goUpbtn">Go Up</button></a>
                    <div class="themeChanger_container" >
                        <button class="themeChanger" id="themeChanger_light" type="button">Light</button>
                        <button class="themeChanger" id="themeChanger_dark" type="button">Dark</button>
                        <button class="themeChanger" id="themeChanger_auto" type="button">Auto</button>
                    </div>
                </div>
            </div>
        `

        
        document.getElementById("headerPage_goUpbtn").addEventListener("click", (event) => {
            event.preventDefault()
            
            document.getElementById("header_global").scrollIntoView({ behavior: 'smooth' })
        })

        handleThemes()

        animatedDiv.classList.add("active")
        animatedDiv.classList.remove("inactive")
        isHeaderActive = true
    } else {
        animatedDiv.classList.add("inactive")
        isHeaderActive = false
        setTimeout(() => {
            animatedDiv.classList.remove("active")
            document.getElementById("headerPage_container").innerHTML = `
            `
        }, 45)
    }
})