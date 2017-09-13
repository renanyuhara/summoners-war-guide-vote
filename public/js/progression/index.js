var earlyGameData = {
    "steps":
        [
            {
                "title" : "Finish story mode",
                "description": "Finish story mode",
                "img": "/img/progression/dark-ifrit.png"
            }
            ,
            {
                "title" : "Fuse Veromos",
                "description": "This is a description",
                "img": "/img/progression/dark-ifrit.png"
            }
            ,
            {
                "title" : "Fuse Veromos",
                "description": "This is a description",
                "img": "/img/progression/dark-ifrit.png"
            }
            ,
            {
                "title" : "Fuse Veromos",
                "description": "This is a description",
                "img": "/img/progression/dark-ifrit.png"
            }
        ]
};

function init()
{
    var isLeft = true;
    var stepCount = 1;
    for (var key in earlyGameData.steps) {
        isLeft = ((stepCount % 2) != 0);
        console.log(stepCount % 2);
        console.log(isLeft);
        if (earlyGameData.steps.hasOwnProperty(key)) {
            var element = earlyGameData.steps[key];
            var stepDirectionText = isLeft ? "left" : "right";
            var html = '<div class="step step-' + stepDirectionText + '">';
            html += '<img src="' + element.img + '">';
            html += '<div class="alert alert-primary" role="alert">' + element.title + '</div></div>';
            document.getElementById("divEarlyGame").innerHTML += html;
        }
        stepCount++;
    }
}