var prevX = null;
function moveFish() {
    const container = document.getElementById('fishcontainer');
    const fishes = document.querySelectorAll('#fish');
  
    for (let i = 0; i < fishes.length; i++) {
        const containerRect = container.getBoundingClientRect();
        const svgRect = fishes[i].getBoundingClientRect();

        const oneVh = window.innerHeight * 0.01;
    
        // Adjust for stroke width by subtracting it from the SVG's dimensions
        const strokeWidth = parseFloat(getComputedStyle(fishes[i]).strokeWidth) || 0;
        const svgWidth = svgRect.width - strokeWidth;
        const svgHeight = svgRect.height - strokeWidth;
    
        // Calculate max X and Y so SVG stays inside container with 1vh margin
        const maxX = containerRect.width - svgWidth - oneVh;
        const maxY = containerRect.height - svgHeight - oneVh;
    
        // Generate random X and Y within allowed range
        const randomX = oneVh + Math.random() * maxX;
        const randomY = oneVh + Math.random() * maxY;
        var scaleX = -1;
        if(prevX < randomX){
            scaleX = 1;
        }
        prevX = randomX;

        console.log(scaleX)
        fishes[i].style.transform = `translate(${randomX}px, ${randomY}px) scaleX(${scaleX})`;
    }
}

function FishMouseHandler(scope) {
    let intervalId;
    let lastMouseMoveTime = Date.now();
    const $fishContainer = $('#fishcontainer');
    let fish = document.querySelector('.selectedfish');
    if (!fish) return; // Safety check
    $(document).on('mousemove', '.selectedfish', function () {
        lastMouseMoveTime = Date.now();
    });
    fish.addEventListener('mouseenter', () => {
        if (intervalId) clearInterval(intervalId);

        intervalId = setInterval(() => {
            const now = Date.now();
            if (now - lastMouseMoveTime > 100) {
                if (scope.progress > 0) {
                    scope.count--;
                    scope.progress = Math.min(scope.count, 100);
                    scope.$apply();
                }
            } else {
                if (scope.progress < 107) {
                    scope.count++;
                    scope.progress = Math.min(scope.count, 107);
                    scope.$apply();
                }
    
                if (scope.progress >= 107) {
                    $('.selectedfish').remove();
                    scope.progress = Math.min(0, 107);
                    scope.count = 0;
                    scope.$apply();
    
                    const $allFish = $('#fishcontainer').find('#fish');
                    const randomFish = $allFish.eq(Math.floor(Math.random() * $allFish.length));
                    randomFish.addClass('selectedfish');
                    const color = $fishContainer.find('.selectedfish path');
                    color.attr('fill', '#' + Math.floor(Math.random()*16777215).toString(16));
                    setTimeout(function () {
                        if (intervalId) clearInterval(intervalId);
                        FishMouseHandler(scope)
                    }, 1500);
                }
            }
        }, 100);
    });

    fish.addEventListener('mouseleave', () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (scope.progress > 0) {
                scope.count--;
                scope.progress = Math.min(scope.count, 100);
                scope.$apply();
            }
        }, 100);
    });
}

angular
.module("FishingProgressBar", [])
.directive("squareProgressBar", $compile => {
    return {
        restrict: 'E',
        scope: {
            progress: '@',
            color: '@',
            stroke: '@'
        },
        template: '',
        compile: () => {
            return {
                pre: (scope, element) => {
                    const $fishContainer = $('#fishcontainer');
                    const randomCount = Math.floor(Math.random() * 3) + 1; // Between 1 and 10
                
                    const svgMarkup = `
                      <div id="fish"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path fill="rgb(202, 79, 79)" d="M13.4228 7.00024c-2.2266.01465-4.24648.66154-5.73389 1.53827-.75153.44298-1.39556.9614-1.86395 1.51679-.05394.0639-.10674.1298-.1579.1975L3.70711 8.29288c-.39053-.39052-1.02369-.39052-1.41422 0-.39052.39053-.39052 1.02369 0 1.41422L4.58579 12l-2.2929 2.2929c-.39052.3905-.39052 1.0237 0 1.4142.39053.3905 1.02369.3905 1.41422 0l1.95995-1.96c.05116.0677.10396.1336.1579.1976.46839.5554 1.11242 1.0738 1.86395 1.5168 1.48608.8759 3.50369 1.5224 5.72789 1.5382-.1119-.1811-.2137-.3588-.2975-.5251-.8831-1.5257-1.4054-2.8736-1.4079-4.3386-.0025-1.4614.5132-2.89857 1.4025-4.59935.0088-.01699.0182-.03371.028-.05015.0924-.15428.1875-.31964.2809-.48626Z"/>
                        <path fill="rgb(202, 79, 79)" fill-rule="evenodd" d="M15.6562 16.7394c1.3837-.3378 2.5644-.962 3.5044-1.6203 1.3918-.9748 2.3082-2.0596 2.6505-2.5342.2519-.3493.2519-.8206 0-1.1698-.3423-.4746-1.2587-1.55947-2.6505-2.53422-.9597-.6721-2.1702-1.30857-3.5914-1.64108-.2021.38166-.4544.84304-.696 1.24836-.8277 1.58764-1.1634 2.67234-1.1618 3.64444.0017.9646.3363 1.9584 1.1534 3.3652.0112.0193.0218.039.0317.059.1641.332.4642.7778.7597 1.1826Zm.3305-6.1117c-.5523 0-1 .4477-1 1s.4477 1 1 1h.01c.5523 0 1-.4477 1-1s-.4477-1-1-1h-.01Z" clip-rule="evenodd"/>
                      </svg></div>
                    `;
                
                    for (let i = 0; i < randomCount; i++) {
                      $fishContainer.append(svgMarkup);
                    }
                    const $allFish = $fishContainer.find('#fish');
                
                    // Choose one at random
                    const randomFish = $allFish.eq(Math.floor(Math.random() * $allFish.length));
                  
                    // Add the selectedfish class to it
                    randomFish.addClass('selectedfish');

                    const color = $fishContainer.find('.selectedfish path');
                    color.attr('fill', '#' + Math.floor(Math.random()*16777215).toString(16));
                    setInterval(moveFish, 3000);

                    scope.pathStyle  = `stroke-dashoffset: 400%; fill: transparent; transition: 1s stroke-dashoffset;`;
                    scope.edgeSize   = element.parent()[0].getBoundingClientRect().width;
                    scope.pathLength = scope.edgeSize * 4;

                    element.css({display: 'block', width: `${scope.edgeSize}px`, height: `${scope.edgeSize}px`});

                    element.html(`
                        <svg style="width:100%;height:100%;">
                            <path style="${scope.pathStyle}" ng-style="{stroke:color, strokeWidth: stroke, strokeDasharray: pathLength, strokeDashoffset: progressRatio}" d="M 0 0 H${scope.edgeSize} V${scope.edgeSize} H0 V0"></path>
                        </svg>
                    `);

                    // Compile the element contents with scope
                    $compile(element.contents())(scope);

                    // Variables to handle the loop and interval
                    scope.count = 0;
                    FishMouseHandler(scope)
                },
                post: (scope, element) => {
                    scope.$watch("progress", () => {
                        scope.progressRatio = scope.pathLength * (1 - Math.max(Math.min(scope.progress, 100), 0) / 100);
                    });
                }
            };
        }
    };
})
.controller("FishProgress", function($scope) {
    $scope.progress = 0; // Initial progress value
});