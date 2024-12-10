// Asetetaan oletusteema latauksen yhteydessä
const currentTheme = localStorage.getItem('torihakutheme') ? localStorage.getItem('torihakutheme') : null;
if (currentTheme) {
    document.documentElement.classList.add(currentTheme);
    if (currentTheme === 'dark') {
        $('#themeToggle span').text('light_mode');
    } else {
        $('#themeToggle span').text('dark_mode');
    }
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
    $('#themeToggle span').text('light_mode');
}

// Käsittele teemanvaihto
$('#themeToggle button').click(function() {
    var isDarkMode = document.documentElement.classList.contains('dark');

    if (isDarkMode) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('torihakutheme', 'light');
        $('#themeToggle span').text('dark_mode');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('torihakutheme', 'dark');
        $('#themeToggle span').text('light_mode');
    }
});