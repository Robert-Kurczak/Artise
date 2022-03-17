var fileMenu = $("#file_menu");
const menuSlideTime = 150;

fileMenu.toggle();

function toggleFileMenu(){
    fileMenu.slideToggle(menuSlideTime);
}

var settings = $("#settings");

settings.toggle();

function toggleSettings(){
    settings.slideToggle(menuSlideTime);
}

var preview = $("#preview");
var resolutionX = $("#resolutionX");
var resolutionY = $("#resolutionY");

function createDocument(){
    preview.html("<canvas id='main_canvas' width=" + resolutionX.val() + " height=" + resolutionY.val() + "></canvas>");
    toggleSettings();
    toggleFileMenu();
}